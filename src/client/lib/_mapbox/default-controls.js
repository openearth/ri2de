import mapboxgl from './_mapbox'
import MapboxDraw from './_mapbox-draw'

import { MAP_BASELAYERS } from './map-config'

import BaselayerControl from './controls/baselayer'
import FitboundsControl from './controls/fit-bounds'
import GeocoderControl from './geocoder-control'

export default function(map) {
  map.__draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        polygon: true,
        trash: true
    }
  })

  map.addControl(GeocoderControl(), 'top-right')
  map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
  map.addControl(new BaselayerControl(MAP_BASELAYERS), 'bottom-right')
  map.addControl(new FitboundsControl(), 'bottom-right')
  map.addControl(map.__draw, 'top-left')
}
