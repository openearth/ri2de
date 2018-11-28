import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

let MapboxDraw

if (process.browser) {
  // Use old skool `require` because there is no support for dynamic `import`.
  // Link directly to the dist file, this prevent the: "Error: Can't resolve 'fs'"
  MapboxDraw = require('@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw')
}

export default MapboxDraw
