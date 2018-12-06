<template>
  <span/>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import { generateWmsLayer, wmsSelectionFromFactor } from '../../lib/project-layers'
import initMapState from '../../lib/mixins/init-map-state'
import wps from '../../lib/wps'

export default {
  computed: {
    ...mapState('hazards', [ 'selectedHazardIndex' ]),
    ...mapState('mapbox/selections', [ 'selections' ]),
    ...mapGetters('hazards', [ 'currentSusceptibilityFactors' ]),
  },
  mounted() {
    if(this.selections.length && typeof this.selectedHazardIndex !== 'undefined') {
      this.$store.commit('setActivePage', 'susceptibilities')
      this.getSelectionLayers()
    } else if (this.selections.length) {
      this.$router.replace({ path: '/hazards' })
    } else {
      this.$router.replace({ path: '/' })
    }
  },
  beforeDestroy() {
    if(!this.currentSusceptibilityFactors) {
      return
    }

    this.currentSusceptibilityFactors.forEach(factor => {
      if(factor.factorLayers) {
        factor.factorLayers.forEach(layer => this.$store.dispatch('mapbox/wms/remove', layer))
      }
    })
  },
  methods: {
    getSelectionLayers() {
      const selectionPolygons = this.selections.map(selection => ({ polygon: selection.polygon[0], identifier: selection.identifier }))
      const currentFactors = this.currentSusceptibilityFactors

      currentFactors.forEach(async (factor, index) => {
        const factorLayers = selectionPolygons.map(async polygon => {
          const wmsLayer = await wmsSelectionFromFactor({ polygon: polygon.polygon, factor, identifier: polygon.identifier })
          this.$store.dispatch('mapbox/wms/add', wmsLayer)
          return wmsLayer.id
        })

        try {
          this.$store.commit('hazards/updateFactorLayers', {
            index,
            factorLayers: await Promise.all(factorLayers)
          })
        } catch(e) {
          console.log('Error: ', e)
        }
      })
    },
    initMapState() {
      this.$store.dispatch('mapbox/selections/setMode', 'static')
    }
  }
}
</script>
