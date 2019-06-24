<template>
  <div>
    <portal to="side-panel-bottom">
      <button
        :disabled="calculatingSusceptibilityLayers || errorCalculatingSusceptibilityLayers"
        class="button button--primary button--full-width"
        @click="calculateTotals"
      >
        Calculate totals
      </button>
    </portal>
    <portal to="map-notification">
      <map-notification
        v-if="calculatingSusceptibilityLayers"
        :message="calculatingMessage"
      />
      <map-notification
        v-else-if="errorCalculatingSusceptibilityLayers"
        :message="errorMessage"
        type="error"
      />
    </portal>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import { generateWmsLayer, wmsSelectionFromFactor, selectionToCustomFactorLayer } from '../../lib/project-layers'
import initMapState from '../../lib/mixins/init-map-state'
import wps from '../../lib/wps'

import { MapNotification } from '../../components'

export default {
  components: { MapNotification },
  mixins: [ initMapState ],
  data() {
    return {
      errorMessage: undefined,
      errorCalculatingSusceptibilityLayers: false,
      calculatingMessage: 'Calculating susceptibility layers...',
      calculatingSusceptibilityLayers: false,
    }
  },
  computed: {
    ...mapState('hazards', [ 'selectedHazardIndex' ]),
    ...mapState('mapbox/selections', [ 'selections' ]),
    ...mapState('susceptibility-layers', [ 'layersPerSelection' ]),
    ...mapGetters('hazards', [ 'currentSusceptibilityFactors' ]),
    ...mapGetters('mapbox/selections', [ 'selectionsToRoadIds' ]),
  },
  mounted() {
    this.$store.commit('setActivePage', 'susceptibilities')
    this.getSelectionLayers()
  },
  beforeDestroy() {
    if(this.currentSusceptibilityFactors) {
      this.currentSusceptibilityFactors.forEach(factor => {
        if(factor.factorLayers) {
          factor.factorLayers.forEach(layer => this.$store.dispatch('mapbox/wms/remove', layer))
        }
      })
    }
  },
  methods: {
    calculateTotals() {
      this.$router.push({ path: '/results' })
    },
    getSelectionLayers() {
      this.calculatingSusceptibilityLayers = true

      this.currentSusceptibilityFactors.forEach(async (factor, index) => {
        const factorLayers = this.selections.map(async selection => {
          const customFactorLayer = await selectionToCustomFactorLayer({ polygon: selection.polygon, factor, identifier: selection.identifier })
          const wmsLayer = generateWmsLayer(customFactorLayer)

          this.$store.dispatch('mapbox/wms/add', {
            ...wmsLayer,
            paint: { 'raster-opacity': index === 0 ? 1 : 0 },
          })
          this.$store.commit('susceptibility-layers/addLayerToSelection', {
            selectionId: selection.id,
            layer: { ...customFactorLayer, susceptibility: factor.title },
           })

          return wmsLayer.id
        })

        try {
          const hazardIndex = this.selectedHazardIndex
          this.$store.commit('hazards/updateFactorVisibility', {
            index, hazardIndex, visible: index === 0 ? true : false
          })
          this.$store.commit('hazards/updateFactorLayers', {
            index, hazardIndex, factorLayers: await Promise.all(factorLayers)
          })
        } catch(e) {
          this.errorMessage = 'Error fetching the layers, reload and try again'
          this.errorCalculatingSusceptibilityLayers = true
          console.log('Error: ', e)
        }
        if(this.currentSusceptibilityFactors && index === this.currentSusceptibilityFactors.length - 1) {
          this.calculatingSusceptibilityLayers = false
        }
      })
    },
    initMapState() {
      this.$store.dispatch('mapbox/selections/setMode', 'static')
    }
  }
}
</script>
