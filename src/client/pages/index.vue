<template>
  <portal to="side-panel">
    <div>
      <div class="selection-steps">
        <!-- Content Card for Infrastucture -->
        <content-card
          :is-expanded="activePage === 'index'"
          :is-completed="hasActiveSelection"
          title="Infrastructure"
          @selectCard="selectCard"
        >
          <div
            v-if="hasActiveSelection"
            slot="info"
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
          <md-button
            slot="actions"
            :disabled="!hasActiveSelection"
            class="md-raised md-accent button--full-width"
            @click="completeInfrastructure"
          >
            Next
          </md-button>
        </content-card>

        <!-- Content Card for Hazards -->
        <content-card
          :is-expanded="activePage === 'hazards'"
          :is-completed="hasActiveHazard"
          :is-use-allowed="hasActiveSelection"
          title="Hazards"
          @selectCard="selectCard"
        >
          <div
            v-if="hasActiveHazard"
            slot="info"
          >
            {{ activeHazardTitle }}
          </div>
          <add-hazard slot="content" />
          <hazards-list
            slot="content"
            :hazards="hazards"
            @select="selectHazard"
            @setWeightFactor="onSetWeightFactor"
            @updateClasses="({ classes, index }) => onUpdateClasses(classes, index)"
            @updateFactorLayer="onUpdateFactorLayer"
          />
        </content-card>

        <!-- Content Card for Translate to risk -->
        <content-card
          :is-expanded="activePage === 'results'"
          :is-completed="activePage === 'classifyrisk'"
          :is-use-allowed="activePage === 'results' || activePage === 'classifyrisk'"
          title="Translate to risk"
          @selectCard="selectCard"
        >
          <translate-to-risk
            slot="content"
            :bufferdist="bufferDist"
            :segmentlength="segmentLength"
            :vulnerabilitylayer="totalsLayers"
            :selections="selections"
            @updateBufferDist="onUpdateBufferDist"
            @updateSegmentLength="onUpdateSegmentLength"            
          />
        </content-card> 
        
        <div v-if="activePage ==='classifyrisk'">
          <p class="md-title">Results for totals of {{ activeHazardTitle }}</p>
          <p class="md-subheading">Classify the risk:</p>
          <risk-class
            :riskclasses="riskClasses"
            @updateRiskClasses="onUpdateRiskClasses"              
          />
        </div>             
      </div>
      <nuxt-child/>
    </div>
  </portal>
</template>

<script>
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'

import { wmsSelectionFromFactor, selectionToCustomFactorLayer, generateWmsLayer } from '../lib/project-layers'
import initMapState from '../lib/mixins/init-map-state'
import layers from '../lib/_mapbox/layers'
import { getHazards, getSusceptibilityFactors } from '../lib/mock-api'

import { InfrastructureList, ContentCard, HazardsList, TranslateToRisk, RiskClass, AddHazard } from '../components'

const INFRASTRUCTURE_DEFAULT_COLOR = '#502D56'
const INFRASTRUCTURE_HIGHLIGHT_COLOR = '#FF0000'

export default {
  components: {
    InfrastructureList,
    ContentCard,
    HazardsList,
    TranslateToRisk,
    RiskClass,
    AddHazard
  },
  mixins: [ initMapState ],
  computed: {
    ...mapState([ 'activePage' ]),
    ...mapState('mapbox/features', [ 'features' ]),
    ...mapState('mapbox/selections', [ 'selections' ]),
    ...mapState('susceptibility-layers', [ 'totalsLayers', 'LayersForRisk' ]),
    ...mapState('hazards', [ 'hazards', 'selectedHazardIndex', 'susceptibilityFactors', 'bufferDist', 'segmentLength', 'riskClasses' ]),
    ...mapGetters('hazards', [ 'currentSusceptibilityFactors' ]),
    ...mapGetters('mapbox', [ 'map' ]),
    infrastructureStyles() {
      return {
        default: INFRASTRUCTURE_DEFAULT_COLOR,
        highlight: INFRASTRUCTURE_HIGHLIGHT_COLOR,
      }
    },
    hasActiveSelection() {
      return !!this.selections.length
    },
    hasActiveHazard() {
      return this.selectedHazardIndex !== null
    },
    activeHazardTitle() {
      const activeHazard = this.hazards[this.selectedHazardIndex]
      return activeHazard ? activeHazard.title : ''
    }
  },
  methods: {
    ...mapMutations({
      onUpdateSelectionTitle: 'mapbox/selections/updateTitle',
      selectHazard: 'hazards/selectHazard',
      updateWeightFactor: 'hazards/updateWeightFactor',
      updateClasses: 'hazards/updateClasses',
      updateFactorLayer:'hazards/updateFactorLayer',
      updateBufferDist: 'hazards/updateBufferDist',
      updateSegmentLength: 'hazards/updateSegmentLength',
      updateRiskClasses: 'hazards/updateRiskClasses',
      addSusceptibilityFactorForCurrentHazard: 'hazards/addSusceptibilityFactorForCurrentHazard'
    }),
    ...mapActions({
      addSusceptibilityFactor: 'hazards/addSusceptibilityFactor'
    }),
    completeInfrastructure() {
      if(this.hasActiveSelection) {
        this.map.fire('fitbounds', undefined)
        this.$router.push({ path: '/hazards' })
      }
    },
    // @REFACTOR :: Is this computed prop needed in the deploy--51 or is this redundant?
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
    },
    onUpdateClasses(classes, index) {
      this.updateClasses({
        hazardIndex: this.selectedHazardIndex,
        susceptibilityIndex: index,
        classes,
      })
      this.updateSusceptibilityLayers({ susceptibilityIndex: index })
    },
    onUpdateFactorLayer({updatedlayer, index}) {
      this.updateFactorLayer({
        hazardIndex: this.selectedHazardIndex,
        susceptibilityIndex: index,
        layer:updatedlayer,
      })
      this.updateSusceptibilityLayers({ susceptibilityIndex: index })
    },
    onUpdateBufferDist(buffer) {
      this.updateBufferDist(buffer)
    },
    onUpdateSegmentLength(segment) {
      this.updateSegmentLength(segment)
    },
    onUpdateRiskClasses(classes) {
      this.updateRiskClasses(classes) 
      this.$store.dispatch('mapbox/features/updateRiskFeatures',classes)  
    },
    selectCard(title) {
      switch (title) {
        case 'Infrastructure':
          this.$router.push({ path: '/project' })
          break

        case 'Hazards':
          this.$router.push({ path: '/hazards' })
          break
        
        case 'Translate to risk':
          this.$router.push({ path: '/results' })          
          break
          
        default:
          break
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
  margin-bottom: calc(var(--triangle-height) / 2);
  height: 100%;
  overflow-y: auto;
}

.calculate-steps {
  flex: 1;
  overflow: auto;
}

.update-susceptibilities {
  display: block;
  text-align: center;
  font-weight: bold;
}
</style>
