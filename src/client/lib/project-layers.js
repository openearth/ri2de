import geoserverUrl from './geoserver-url'
import layers from './_mapbox/layers'

const NAMESPACE = 'road'
const LAYER = 'global_roads'

const url = geoserverUrl({
  service: 'WMS',
  request: 'GetMap',
  layers: `${NAMESPACE}:${LAYER}`,
  width: 256,
  height: 256,
  srs: 'EPSG:3857',
  encode: false,
})

const layer = layers.wms({
  id: LAYER,
  tiles: [ url ],
  tileSize: 256
})

export function globalRoads() {
  return layer
}
