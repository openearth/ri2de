import 'mapbox-gl/dist/mapbox-gl.css'

let mapboxgl

if (process.browser) {
  // use old skool `require` because there is no support for dynamic `import`
  mapboxgl = require('mapbox-gl')
  mapboxgl.accessToken = process.env.MAPBOX_TOKEN
}

export default mapboxgl
