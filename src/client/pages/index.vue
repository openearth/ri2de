<template>
  <portal to="side-panel">
    <div>
      <span>Selection panesz</span>
      <button @click="editSelectedFeatures">
        {{ editingSelectedFeatures? 'Stop the cut' : 'Cut road' }}
      </button>
    </div>
  </portal>
</template>

<script>
import flattenFeature from '@turf/flatten'
import lineSlice from '@turf/line-slice'
import { mapState } from 'vuex'

import geoserverUrl from '../lib/geoserver-url'
import getFeatureInfo from '../lib/get-feature-info'
import initMapState from '../lib/mixins/init-map-state'
import layers from '../lib/_mapbox/layers'

export default {
  mixins: [ initMapState ],
  data() {
    return {
      editingSelectedFeatures: false,
      featureSlice: {},
    }
  },
  computed: {
    ...mapState('mapbox/features', [ 'features' ]),
    selectedFeature() {
      return this.features[0]
    }
  },
  methods: {
    editSelectedFeatures() {
      this.$store.dispatch('mapbox/removeEventHandler', { event: 'click' })
      if(this.editingSelectedFeatures) {
        this.$store.dispatch('mapbox/addEventHandler', {
          event: 'click',
          handler: (event) => this.mapClickHandler(event)
        })
        this.editingSelectedFeatures = false
        this.featureSlice = {}
      } else {
        this.$store.dispatch('mapbox/addEventHandler', {
          event: 'click',
           handler: (event) => this.sliceFeature(event)
        })
        this.editingSelectedFeatures = true
      }
    },
    initMapState() {
      const NAMESPACE = 'road'
      const LAYER = 'global_roads'

      const url = geoserverUrl({
        service: 'WMS',
        request: 'GetMap',
        layers: `${NAMESPACE}:${LAYER}`,
        width: 256,
        height: 256,
        encode: false,
      })

      const layer = layers.wms({
        id: LAYER,
        tiles: [ url ],
        tileSize: 256
      })

      this.$store.dispatch('mapbox/wms/add', layer)
      this.$store.dispatch('mapbox/addEventHandler', {
        event: 'click',
        handler: (event) => this.mapClickHandler(event)
      })

    },
    mapClickHandler({ point, target, ...rest }) {
      const canvas = target.getCanvas()
      const { _ne, _sw } = target.getBounds()
      const { x, y } = point

      console.log('rest', rest)

      getFeatureInfo({
        layer: 'road:global_roads',
        ne: _ne,
        sw: _sw,
        width: canvas.offsetWidth,
        height: canvas.offsetHeight,
        x,
        y,
      })
        .then(feature => {
          if(!feature) {
            console.log('No Feature')
          } else if(target.getLayer(feature.properties.roadid)) {
            this.$store.dispatch('mapbox/features/remove', feature.properties.roadid)
            this.$store.dispatch('mapbox/features/remove', `${feature.properties.roadid}-slice`)
          } else {
            this.$store.dispatch('mapbox/features/add', layers.geojson.line({
              id: feature.properties.roadid,
              data: feature,
              paint: {
                'line-width': 10,
                'line-color': "#ff0000",
                'line-opacity': 0.7,
              },
            }))
          }
        })
    },
    sliceFeature({ lngLat }) {
      if(!this.featureSlice.start) {
        this.featureSlice.start = [ lngLat.lng, lngLat.lat ]
        return
      } else if(!this.featureSlice.end) {
        this.featureSlice.end = [ lngLat.lng, lngLat.lat ]
      }

      if(this.featureSlice.start && this.featureSlice.end) {
        const slicedFeature = lineSlice(
          this.featureSlice.start,
          this.featureSlice.end,
          flattenFeature(this.selectedFeature.source.data).features[0]
        )

        this.$store.dispatch('mapbox/features/add', layers.geojson.line({
          id: `${slicedFeature.properties.roadid}-slice`,
          data: slicedFeature,
          paint: {
            'line-width': 10,
            'line-color': "#ff00ff",
            'line-opacity': 0.7,
          },
        }))
      }
    }
  }
}
</script>

<style>

</style>
