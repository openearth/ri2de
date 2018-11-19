require('dotenv-safe').config()
const build = require('./config/nuxt/build')
const head = require('./config/nuxt/head')
const plugins = require('./config/nuxt/plugins')
const proxy = require('./config/nuxt/proxy')

module.exports = {
  env: {
    // pass Node env variables to Nuxt env:
    GEOSERVER_BASE_URL: process.env.GEOSERVER_BASE_URL,
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
  },

  mode: 'universal',
  srcDir: 'src/client/',
  generate: {
    dir: 'dist/client/',
  },

  build,
  head,
  loading: { color: '#fff' },
  modules: [ '@nuxtjs/proxy' ],
  plugins,
  proxy,
}
