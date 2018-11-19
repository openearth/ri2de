<template>
  <portal to="side-panel">
    <span>portaaal gek</span>
  </portal>
</template>

<script>
import geoserverUrl from '../lib/geoserver-url'
import initMapState from '../lib/mixins/init-map-state'
import layerFactory from '../lib/_mapbox/layer-factory'

export default {
  mixins: [ initMapState ],
  mounted() {
    console.log('Mounted')
  },
  methods: {
    initMapState() {
      console.log('Init map state')
      const NAMESPACE = 'hydrology'
      const LAYER = 'export_32634'

      const url = geoserverUrl({
        service: 'WMS',
        request: 'GetMap',
        layers: `${NAMESPACE}:${LAYER}`,
        width: 1024,
        height: 1024,
        encode: false,
      })

      const layer = layerFactory.wms({
        id: 'test-layer',
        tiles: [ url ],
        tileSize: 1024
      })

      console.log('GEO URL', url, layer)
      this.$store.dispatch('mapbox/wms/add', layer)
    }
  }
}
</script>

<style>

</style>
