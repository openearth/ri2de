<template>
  <portal to="side-panel">
    <div>
      <span>Selection panesz</span>
      <infrastructure-list
        :infrastructure="features"
        @delete="deleteInfrastructure"
        @mouseover="enterInfrastructureItem"
        @mouseout="leaveInfrastructureItem"
      />
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

import { InfrastructureList } from '../components'

const INFRASTRUCTURE_DEFAULT_COLOR = '#A34751'
const INFRASTRUCTURE_HIGHLIGHT_COLOR = '#FF0000'

export default {
  components: { InfrastructureList },
  mixins: [ initMapState ],
  computed: {
    ...mapState('mapbox/features', [ 'features' ]),
  },
  methods: {
    deleteInfrastructure(id) {
      this.$store.dispatch('mapbox/features/remove', id)
    },
    enterInfrastructureItem(id) {
      this.$store.dispatch('mapbox/features/setStyle', {
        id,
        styleOption: 'line-color',
        value: INFRASTRUCTURE_HIGHLIGHT_COLOR,
      })
    },
    leaveInfrastructureItem(id) {
      this.$store.dispatch('mapbox/features/setStyle', {
        id,
        styleOption: 'line-color',
        value: INFRASTRUCTURE_DEFAULT_COLOR,
      })
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
      this.features
        .map(feature => feature.source.data)
        .forEach(feature => {
          this.$store.dispatch('mapbox/features/add', layers.geojson.line({
            id: feature.properties.osm_id,
            data: feature,
            paint: {
              'line-width': 10,
              'line-color': INFRASTRUCTURE_DEFAULT_COLOR,
              'line-opacity': 0.6,
            },
          }))
        })
    },
    mapClickHandler({ point, target, ...rest }) {
      const canvas = target.getCanvas()
      const { _ne, _sw } = target.getBounds()
      const { x, y } = point

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
          } else if(target.getLayer(feature.properties.osm_id)) {
            this.$store.dispatch('mapbox/features/remove', feature.properties.osm_id)
          } else {
            this.$store.dispatch('mapbox/features/add', layers.geojson.line({
              id: feature.properties.osm_id,
              data: feature,
              paint: {
                'line-width': 10,
                'line-color': INFRASTRUCTURE_DEFAULT_COLOR,
                'line-opacity': 0.6,
              },
            }))
          }
        })
    },
  }
}
</script>

<style>

</style>
