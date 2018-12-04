<template>
  <span/>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import { generateWmsLayer } from '../../lib/project-layers'
import initMapState from '../../lib/mixins/init-map-state'
import wps from '../../lib/wps'

export default {
  computed: {
    ...mapState('hazards', [ 'selectedHazardIndex' ]),
    ...mapState('mapbox/selections', [ 'selections' ]),
    ...mapGetters('hazards', [ 'currentSusceptibilityFactors' ])
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
      const selectionPolygons = this.selections.map(selection => selection.polygon[0])
      const currentFactors = this.currentSusceptibilityFactors

      currentFactors.forEach(async (factor, index) => {
        const factorLayers = selectionPolygons.map(async polygon => {
          const wpsResponse = await wps({
            functionId: factor.wpsFunctionId,
            requestData: {
              classes: factor.classes,
              layername: factor.layerName,
              owsurl: factor.owsUrl
            },
            polygon
          })
          const { baseUrl, layerName, style } = wpsResponse.data
          const layerId = `${polygon.id}-${factor.title}`
          const wmsLayer = generateWmsLayer({
            url: baseUrl,
            layer: layerName,
            id: layerId,
            paint: { 'raster-opacity': 1 },
            style,
          })

          this.$store.dispatch('mapbox/wms/add', wmsLayer)
          return layerId
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
