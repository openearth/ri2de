let MapboxGeocoder

if (process.browser) {
  // use old skool `require` because there is no support for dynamic `import`
  MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder')
}

import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

export default function() {
  return new MapboxGeocoder({
    accessToken: process.env.MAPBOX_TOKEN,
  })
}
