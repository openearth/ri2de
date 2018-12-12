<template>
  <portal to="map-notification">
    <map-notification
      v-if="calculating"
      :message="calculatingMessage"
    />
    <map-notification
      v-else-if="errorFetchingTotals"
      :message="errorMessage"
      type="error"
    />
  </portal>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import { generateWmsLayer } from '../../lib/project-layers'
import initMapState from '../../lib/mixins/init-map-state'
import wps from '../../lib/wps'

import { MapNotification } from '../../components'

export default {
  components: { MapNotification },
  mixins: [ initMapState ],
  data() {
    return {
      calculating: true,
      calculatingMessage: 'Calculating the total susceptibility map...',
      errorMessage: undefined,
      errorFetchingTotals: false,
    }
  },
  computed: {
    ...mapState('mapbox/selections', [ 'selections' ]),
    ...mapState('susceptibility-layers', [ 'layersPerSelection', 'totalsLayers' ]),
    ...mapGetters('hazards', [ 'currentSusceptibilityWeightsByTitle' ]),
    ...mapGetters('mapbox/selections', [ 'selectionsToRoadIds' ]),
  },
  beforeDestroy() {
    this.totalsLayers.forEach(layer => {
      this.$store.dispatch('mapbox/wms/remove', layer.id)
    })
    this.$store.commit('susceptibility-layers/resetTotalsLayers')
  },
  mounted() {
    if(Object.keys(this.layersPerSelection).length) {
      this.$store.commit('setActivePage', 'results')
      this.calculateTotals()
    } else {
      this.$router.replace({ path: '/susceptibilities' })
    }
  },
  methods: {
    async calculateTotals() {
      const selectionsToRequest = Object.keys(this.layersPerSelection).map(key => {
        return {
          layers: this.layersPerSelection[key],
          roadsIdentifier: this.selectionsToRoadIds[key]
        }
      })
      .map(selections => {
        return {
          ...selections,
          layers: Object.keys(selections.layers).map(key => {
            const layer = selections.layers[key]
            return {
              ...layer,
              weight: this.currentSusceptibilityWeightsByTitle[layer.susceptibility] || 1
            }
          })
        }
      })

      try {
        const totals = await Promise.all(selectionsToRequest.map(selection => {
          const layers = selection.layers.map(layer => ({ ...layer, layername: layer.layer, owsurl: layer.url }))
          return wps({
            functionId: 'ri2de_calc_total',
            requestData: layers,
            roadsIdentifier: selection.roadsIdentifier
          })
        }))

        totals.forEach(total => {
          const { baseUrl, layerName, style } = total
          const layerObject = {
            url: baseUrl,
            layer: layerName,
            id: layerName,
            style,
          }

          const wmsLayer = generateWmsLayer(layerObject)
          this.$store.dispatch('mapbox/wms/add', wmsLayer)
          this.$store.commit('susceptibility-layers/addTotalsLayer', layerObject)
        })
      } catch(e) {
        this.errorMessage = 'Error fetching the total susceptibility maps, reload and try again'
        this.errorFetchingTotals = true
        console.error(`Error: ${e}`)
      }
      this.calculating = false
    },
    initMapState() {
      this.$store.dispatch('mapbox/selections/setMode', 'static')
    }
  }
}
</script>
