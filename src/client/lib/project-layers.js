import geoserverUrl from './geoserver-url'
import layers from './_mapbox/layers'

const globalRoadsUrl = geoserverUrl({
  service: 'WMS',
  request: 'GetMap',
  layers: 'road:global_roads',
  width: 256,
  height: 256,
  srs: 'EPSG:3857',
  transparent: true,
  bbox: '{bbox-epsg-3857}',
  format: 'image/png',
  encode: false
})

export const globalRoads = layers.wms({
  id: 'global_roads',
  tiles: [ globalRoadsUrl ],
  tileSize: 256
})
