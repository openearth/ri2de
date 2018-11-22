import GeocoderControl from './geocoder-control'

export default function(map) {
  map.addControl(GeocoderControl(), 'top-right')
}
