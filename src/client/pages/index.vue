<template>
  <portal to="side-panel">
    <div>
      <content-card
        :is-active="activePage === 'index'"
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
        <p
          v-else
          slot="content"
        >
          Select the infrastructure you want to conduct calculations on
        </p>

        <md-button
          slot="actions"
          :disabled="selections.length === 0"
          class="md-raised md-primary"
          @click="completeInfrastructure"
        >
          Next
        </md-button>
      </content-card>
      <content-card
        :is-active="activePage === 'hazards'"
        title="Hazards"
        @selectCard="selectCard"
      >
        <hazards-list
          slot="content"
          :hazards="hazards"
          :initial-selection="selectedHazardIndex"
          @select="selectHazard"
        />
        <md-button
          slot="actions"
          :disabled="typeof selectedHazardIndex !== 'number'"
          class="md-raised md-primary bnt-save"
          @click="completeHazards"
        >
          Next
        </md-button>
      </content-card>
      <susceptibility-list
        v-if="activePage === 'susceptibilities'"
        :factors="currentSusceptibilityFactors"
        @setWeightFactor="onSetWeightFactor"
        @updateClasses="({ classes, index }) => onUpdateClasses(classes, index)"
        @reset="onResetSusceptibilityFactors"
        @toggleFactorActivity="toggleSusceptibilityLayer"
      />
      <nuxt-child/>
    </div>
  </portal>
</template>

<script>
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'

import { globalRoads } from '../lib/project-layers'
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
      bootstrapHazardsList: 'hazards/bootstrapHazards',
      onResetSusceptibilityFactors: 'hazards/resetSusceptibilityFactors'
    }),
    deleteInfrastructure(index) {
      const selection = this.selections[index]

      if(!selection) return

      this.$store.dispatch('mapbox/selections/delete', selection.id)
      selection.features.forEach(featureId => {
        this.$store.dispatch('mapbox/features/remove', featureId)
      })
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
    onSetWeightFactor({ value, index }) {
      this.updateWeightFactor({
        hazardIndex: this.selectedHazardIndex,
        susceptibilityIndex: index,
        weightFactor: value
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
    onUpdateClasses(classes, index) {
      this.updateClasses({
        hazardIndex: this.selectedHazardIndex,
        susceptibilityIndex: index,
        classes,
      })
    },
    toggleSusceptibilityLayer({ index, active }) {
      const factor = this.currentSusceptibilityFactors[index]
      if(factor.factorLayers) {
        factor.factorLayers.forEach(layer => {
          this.$store.dispatch('mapbox/wms/setOpacity', {
            id: layer,
            opacity: active ? 1 : 0
          })
        })
      }
    }
  },
}
</script>

<style>
.content-card {
  margin-bottom: var(--spacing-default);
}
</style>
