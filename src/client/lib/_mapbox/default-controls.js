import mapboxgl from './_mapbox'
import { MAP_BASELAYERS } from './map-config'

import BaselayerControl from './controls/baselayer'
import FitboundsControl from './controls/fit-bounds'
import GeocoderControl from './geocoder-control'

export default function(map) {
  map.addControl(GeocoderControl(), 'top-right')
  map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
  map.addControl(new BaselayerControl(MAP_BASELAYERS), 'bottom-right')
  map.addControl(new FitboundsControl(), 'bottom-right')
}
