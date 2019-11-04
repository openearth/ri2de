import mapboxgl from './_mapbox'

import { MAP_BASELAYERS } from './map-config'

import { BaselayerControl, DrawControl, FitboundsControl, GeocoderControl } from './controls'

import initControlTooltips from './controls/control-tooltips'

export default function(map) {
  map.__draw = DrawControl()

  map.addControl(GeocoderControl(), 'top-left')
  map.addControl(map.__draw, 'top-left')
  map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
  map.addControl(new BaselayerControl(MAP_BASELAYERS), 'bottom-right')
  map.addControl(new FitboundsControl(), 'top-left')

  initControlTooltips();
}
