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
  methods: {
    getSelectionLayers() {
      const polygons = this.selections.map(selection => selection.polygon[0])
      const factors = this.currentSusceptibilityFactors.map(factor => ({
        classes: factor.classes,
        layername: factor.layerName,
        owsurl: factor.owsUrl
      }))

      console.log('polygons', polygons)
      console.log('factors', factors)

      const sus = this.currentSusceptibilityFactors[0]
      wps({
        functionId: sus.wpsFunctionId,
        requestData: {
          classes: sus.classes,
				  layername: sus.layerName,
				  owsurl: sus.owsUrl
        },
        polygon: polygons[0]
      })
      .then(res => {
        const { baseUrl, layerName, style } = res.data
        const wmsLayer = generateWmsLayer({
          url: baseUrl,
          layer: layerName,
          id: layerName,
          style
        })

        this.$store.dispatch('mapbox/wms/add', wmsLayer)
      })
    },
    initMapState() {
      this.$store.dispatch('mapbox/selections/setMode', 'static')
    }
  }
}
</script>
