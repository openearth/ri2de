import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

let MapboxDraw

if (process.browser) {
  // use old skool `require` because there is no support for dynamic `import`
  MapboxDraw = require('@mapbox/mapbox-gl-draw')
}

export default MapboxDraw
