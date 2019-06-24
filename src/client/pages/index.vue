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
          <div
            v-if="selections.length"
            slot="info"
            class="content-card__header__info"
          >
            {{ `${selections.length} selected area${selections.length > 1 ? 's' : ''}` }}
          </div>
          <infrastructure-list
            slot="content"
            :infrastructure="selections"
            @delete="deleteInfrastructure"
            @mouseover="(index) => updateInfrastructureStyle(index, infrastructureStyles.highlight)"
            @mouseout="(index) => updateInfrastructureStyle(index, infrastructureStyles.default)"
            @updateSelectionTitle="onUpdateSelectionTitle"
          />
          <button
            slot="actions"
            :disabled="selections.length === 0"
            class="button button--primary button--full-width"
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
            class="content-card__header__info"
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
            class="button button--primary button--full-width"
            @click="completeHazards"
          >
            Next
          </button>
        </content-card>
      </div>
      <div class="calculate-steps">
        <susceptibility-list
          v-if="activePage === 'susceptibilities'"
          :factors="currentSusceptibilityFactors || []"
          @setWeightFactor="onSetWeightFactor"
          @updateClasses="({ classes, index }) => onUpdateClasses(classes, index)"
          @toggleFactorActivity="toggleSusceptibilityLayer"
        />
        <nuxt-link
          v-if="activePage === 'results' && totalsLayers && totalsLayers.length"
          :to="'/susceptibilities'"
          class="update-susceptibilities md-accent"
        >
          Update susceptibility settings
        </nuxt-link>
        <nuxt-child/>
      </div>
    </div>
  </portal>
</template>

<script>
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'

import { wmsSelectionFromFactor, selectionToCustomFactorLayer, generateWmsLayer } from '../lib/project-layers'
import initMapState from '../lib/mixins/init-map-state'
import layers from '../lib/_mapbox/layers'
import { getHazards, getSusceptibilityFactors } from '../lib/mock-api'

import { InfrastructureList, ContentCard, HazardsList, SusceptibilityList } from '../components'

const INFRASTRUCTURE_DEFAULT_COLOR = '#502D56'
const INFRASTRUCTURE_HIGHLIGHT_COLOR = '#FF0000'

export default {
  components: { InfrastructureList, ContentCard, HazardsList, SusceptibilityList },
  mixins: [ initMapState ],
  computed: {
    ...mapState([ 'activePage' ]),
    ...mapState('mapbox/features', [ 'features' ]),
    ...mapState('mapbox/selections', [ 'selections' ]),
    ...mapState('susceptibility-layers', [ 'totalsLayers' ]),
    ...mapState('hazards', [ 'hazards', 'selectedHazardIndex', 'susceptibilityFactors' ]),
    ...mapGetters('hazards', [ 'currentSusceptibilityFactors' ]),
    infrastructureStyles() {
      return {
        default: INFRASTRUCTURE_DEFAULT_COLOR,
        highlight: INFRASTRUCTURE_HIGHLIGHT_COLOR,
      }
    }
  },
  beforeMount() {
    if (this.selectedHazardIndex !== undefined) {
      this.$router.replace('/susceptibilities')
    } else if (this.selections.length) {
      this.$router.replace('/hazards')
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
      addSusceptibilityFactorForCurrentHazard: 'hazards/addSusceptibilityFactorForCurrentHazard'
    }),
    ...mapActions({
      bootstrapHazardsList: 'hazards/bootstrapHazards',
      addSusceptibilityFactor: 'hazards/addSusceptibilityFactor'
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
    },
    onSetWeightFactor({ value, index }) {
      this.updateWeightFactor({
        hazardIndex: this.selectedHazardIndex,
        susceptibilityIndex: index,
        weightFactor: value,
      })
      this.updateSusceptibilityLayers({ susceptibilityIndex: index })
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
          this.$router.push({ path: '/project' })
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
      const selectionPolygons = this.selections
      const susceptibility = this.currentSusceptibilityFactors[susceptibilityIndex]
      const customFactorLayers = await Promise.all(this.selections.map( async selection => {
        this.$store.dispatch('mapbox/wms/remove', `${selection.polygon.id}-${susceptibility.title}`)

        const customLayer = await selectionToCustomFactorLayer({ ...selection, factor: susceptibility })
        this.$store.dispatch('mapbox/wms/add', generateWmsLayer({
          ...customLayer,
          paint: { 'raster-opacity': susceptibility.visible ? 1 : 0 }
        }))
        this.$store.commit('susceptibility-layers/addLayerToSelection', {
          selectionId: selection.id,
          layer: { ...customLayer, susceptibility: susceptibility.title },
        })
      }))
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
.selection-steps {
  background-color: var(--neutral-color--light);
  padding: var(--spacing-default);
  position: relative;
  --triangle-height: 30px;
  --triangle-width: 25px;
  margin-bottom: calc(var(--triangle-height) / 2);
}

.calculate-steps {
  flex: 1;
  overflow: auto;
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

.update-susceptibilities {
  display: block;
  text-align: center;
  font-weight: bold;
}
</style>
