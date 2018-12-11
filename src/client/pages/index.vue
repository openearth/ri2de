<template>
  <portal to="side-panel">
    <div>
      <div class="selection-steps">
        <content-card
          :is-expanded="activePage === 'index'"
          :is-completed="!!selections.length"
          title="Infrastructure"
          @selectCard="selectCard"
        >
          <infrastructure-list
            v-if="features.length"
            slot="content"
            :infrastructure="selections"
            @delete="deleteInfrastructure"
            @mouseover="(index) => updateInfrastructureStyle(index, infrastructureStyles.highlight)"
            @mouseout="(index) => updateInfrastructureStyle(index, infrastructureStyles.default)"
            @updateSelectionTitle="onUpdateSelectionTitle"
          />
          <div
            v-else
            slot="content"
            class="infrastructure-list__description"
          >
            <md-icon
              :md-src="'/images/polygon.svg'"
              class="infrastructure-list__description-icon"
            />
            <p>Select the infrastructure you want to conduct calculations on</p>
          </div>

          <button
            slot="actions"
            :disabled="selections.length === 0"
            class="button button--primary"
            @click="completeInfrastructure"
          >
            Next
          </button>
        </content-card>
        <content-card
          :is-expanded="activePage === 'hazards'"
          :is-completed="typeof selectedHazardIndex === 'number'"
          title="Hazards"
          @selectCard="selectCard"
        >
          <div
            v-if="typeof selectedHazardIndex === 'number'"
            slot="info"
            class="info"
          >
            {{ hazards[selectedHazardIndex].title }}
          </div>
          <hazards-list
            slot="content"
            :hazards="hazards"
            :initial-selection="selectedHazardIndex"
            @select="selectHazard"
          />
          <button
            slot="actions"
            :disabled="typeof selectedHazardIndex !== 'number'"
            class="button button--primary"
            @click="completeHazards"
          >
            Next
          </button>
        </content-card>
      </div>
      <div class="calculate-steps">
        <susceptibility-list
          v-if="activePage === 'susceptibilities'"
          :factors="currentSusceptibilityFactors"
          @setWeightFactor="onSetWeightFactor"
          @updateClasses="({ classes, index }) => onUpdateClasses(classes, index)"
          @toggleFactorActivity="toggleSusceptibilityLayer"
        />
        <nuxt-child/>
      </div>
    </div>
  </portal>
</template>

<script>
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'

import { globalRoads, wmsSelectionFromFactor } from '../lib/project-layers'
import initMapState from '../lib/mixins/init-map-state'
import layers from '../lib/_mapbox/layers'
import { getHazards, getSusceptibilityFactors } from '../lib/mock-api'

import { InfrastructureList, ContentCard, HazardsList, SusceptibilityList } from '../components'

const INFRASTRUCTURE_DEFAULT_COLOR = '#A34751'
const INFRASTRUCTURE_HIGHLIGHT_COLOR = '#FF0000'

export default {
  components: { InfrastructureList, ContentCard, HazardsList, SusceptibilityList },
  mixins: [ initMapState ],
  computed: {
    ...mapState([ 'activePage' ]),
    ...mapState('mapbox/features', [ 'features' ]),
    ...mapState('mapbox/selections', [ 'selections' ]),
    ...mapState('hazards', [ 'hazards', 'selectedHazardIndex', 'susceptibilityFactors' ]),
    ...mapGetters('hazards', [ 'currentSusceptibilityFactors' ]),
    infrastructureStyles() {
      return {
        default: INFRASTRUCTURE_DEFAULT_COLOR,
        highlight: INFRASTRUCTURE_HIGHLIGHT_COLOR,
      }
    }
  },
  mounted() {
    this.bootstrapHazardsList()
  },
  methods: {
    ...mapMutations({
      onUpdateSelectionTitle: 'mapbox/selections/updateTitle',
      selectHazard: 'hazards/selectHazard',
      updateWeightFactor: 'hazards/updateWeightFactor',
      updateClasses: 'hazards/updateClasses',
    }),
    ...mapActions({
      bootstrapHazardsList: 'hazards/bootstrapHazards'
    }),
    completeInfrastructure() {
      if(this.selections.length) {
        this.$router.push({ path: '/hazards' })
      }
    },
    completeHazards() {
      if(typeof this.selectedHazardIndex !== 'undefined' && this.selectedHazardIndex >= 0) {
        this.$router.push({ path: '/susceptibilities' })
      }
    },
    deleteInfrastructure(index) {
      const selection = this.selections[index]

      if(!selection) return

      this.$store.dispatch('mapbox/selections/delete', selection.id)
      selection.features.forEach(featureId => {
        this.$store.dispatch('mapbox/features/remove', featureId)
      })
    },
    initMapState() {
      this.$store.dispatch('mapbox/wms/add', globalRoads)

      this.features
        .forEach(feature => {
          this.$store.dispatch('mapbox/features/add', layers.geojson.line({
            id: feature.id,
            data: feature.source.data,
            paint: {
              'line-width': 5,
              'line-color': INFRASTRUCTURE_DEFAULT_COLOR,
              'line-opacity': 0.8,
            },
          }))
        })

      this.selections
        .map(selection => selection.polygon[0])
        .forEach(selection => {
          this.$store.dispatch('mapbox/selections/draw', selection)
        })
    },
    onSetWeightFactor({ value, index }) {
      this.updateWeightFactor({
        hazardIndex: this.selectedHazardIndex,
        susceptibilityIndex: index,
        weightFactor: value,
      })
    },
    onUpdateClasses(classes, index) {
      this.updateClasses({
        hazardIndex: this.selectedHazardIndex,
        susceptibilityIndex: index,
        classes,
      })
      this.updateSusceptibilityLayers({ susceptibilityIndex: index })
    },
    selectCard(title) {
      switch (title) {
        case 'Infrastructure':
          this.$router.push({ path: '/' })
          break

        case 'Hazards':
          this.$router.push({ path: '/hazards' })
          break

        default:
          break
      }
    },
    toggleSusceptibilityLayer({ index, active }) {
      const factor = this.currentSusceptibilityFactors[index]
      this.$store.commit('hazards/updateFactorVisibility', {
        hazardIndex: this.selectedHazardIndex, index, visible: active ? true : false
      })
      if(factor.factorLayers) {
        factor.factorLayers.forEach(layer => {
          this.$store.dispatch('mapbox/wms/setOpacity', {
            id: layer,
            opacity: active ? 1 : 0
          })
        })
      }
    },
    async updateSusceptibilityLayers({ susceptibilityIndex }) {
      const selectionPolygons = this.selections.map(selection => ({ polygon: selection.polygon[0], identifier: selection.identifier }))
      const susceptibility = this.currentSusceptibilityFactors[susceptibilityIndex]
      const layerPromises = selectionPolygons.map(polygon => {
        this.$store.dispatch('mapbox/wms/remove', `${polygon.polygon.id}-${susceptibility.title}`)
        return wmsSelectionFromFactor({ polygon: polygon.polygon, factor: susceptibility, identifier: polygon.identifier })
      })
      const layers = await Promise.all(layerPromises)

      layers.forEach(layer => this.$store.dispatch('mapbox/wms/add', layer))
    },
    updateInfrastructureStyle(index, style) {
      const infrastructure = this.selections[index]

      if(!infrastructure) return

      this.$store.dispatch('mapbox/features/setStyle', {
        id: infrastructure.features[0],
        styleOption: 'line-color',
        value: style,
      })
    },
  },
}
</script>

<style>
.content-card {
  margin-bottom: var(--spacing-default);
}

.info {
  margin-left: auto;
  margin-right: var(--spacing-default);
  color: #fff;
  opacity: .5;
}

.infrastructure-list__description {
  display: flex;
  padding: var(--spacing-default) 0;
}

.infrastructure-list__description p {
  margin: 0;
}

.infrastructure-list__description-icon {
  margin: 0;
  margin-right: var(--spacing-half);
}

.infrastructure-list__description-icon svg {
  fill: #6D6D6D !important;
}

.selection-steps {
  background-color: var(--neutral-color--light);
  padding: var(--spacing-default);
  position: relative;
  --triangle-height: 30px;
  --triangle-width: 25px;
  margin-bottom: var(--triangle-height);
}

.selection-steps:after {
  position: absolute;
  bottom: calc(var(--triangle-height) * -1);
  left: calc(50% - calc(var(--triangle-width)/2));
  content: '';
  width: var(--triangle-width);
  height: var(--triangle-height);
  border-top: calc(var(--triangle-height)/2) solid var(--neutral-color--light);
  border-left: calc(var(--triangle-width)/2) solid transparent;
  border-right: calc(var(--triangle-width)/2) solid transparent;
}

.calculate-steps {
  padding: 0 var(--spacing-default);
}
</style>
