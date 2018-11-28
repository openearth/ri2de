import { MapboxGeocoder } from '../_mapbox'

export default function() {
  return new MapboxGeocoder({
    accessToken: process.env.MAPBOX_TOKEN,
  })
}
