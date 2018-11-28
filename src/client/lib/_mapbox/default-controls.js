import mapboxgl from './_mapbox'

import { MAP_BASELAYERS } from './map-config'

import { BaselayerControl, DrawControl, FitboundsControl, GeocoderControl } from './controls'

export default function(map) {
  map.__draw = DrawControl()

  console.log("DRAW", map.__draw)

  map.addControl(map.__draw, 'top-left')
  map.addControl(GeocoderControl(), 'top-right')
  map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
  map.addControl(new BaselayerControl(MAP_BASELAYERS), 'bottom-right')
  map.addControl(new FitboundsControl(), 'bottom-right')
}
