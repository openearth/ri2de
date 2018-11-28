import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

let mapboxgl
let MapboxDraw
let MapboxGeocoder

if (process.browser) {
  // use old skool `require` because there is no support for dynamic `import`
  mapboxgl = require('mapbox-gl')
  mapboxgl.accessToken = process.env.MAPBOX_TOKEN

  MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder')
  MapboxDraw = require('@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw')
}

export {
  mapboxgl as default,
  MapboxDraw,
  MapboxGeocoder
}
