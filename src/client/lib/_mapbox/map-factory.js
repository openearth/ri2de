import mapboxgl from './_mapbox'
import { MAP_CENTER, MAP_ZOOM } from './map-config'

import addDefaultControlsToMap from './default-controls'

export default function(container) {
  let mapLayers = []

  const map = new mapboxgl.Map({
    container,
    center: MAP_CENTER,
    zoom: MAP_ZOOM,
    style: 'mapbox://styles/pulautekong/cjwud8m561cby1cp6z82kbkco'
  })

  // We overwrite the addLayer method of the map.
  // We do this to keep track of the layers that are currently visible on the map.
  // This way we can re-render the layers when we switch baselayers/styles
  const _addLayer = map.addLayer.bind(map)
  map.addLayer = (layer, before) => {
    mapLayers.push(layer)
    _addLayer(layer, before)
  }

  // We overwrite the removeLayer method of the map.
  // We do this to keep track of the layers that are currently visible on the map.
  // This way we can re-render the layers when we switch baselayers/styles
  const _removeLayer = map.removeLayer.bind(map)
  map.removeLayer = (id) => {
    mapLayers = mapLayers.filter((layer) => layer.id !== id)
    _removeLayer(id)
  }

  map.on('load', () => addDefaultControlsToMap(map))

  map.on('style.load', () => {
    mapLayers.forEach(layer => {
      _addLayer(layer)
    })
  })

  return map
}
