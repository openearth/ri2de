/**
 * @see https://nuxtjs.org/api/configuration-plugins
 */
module.exports = [
  // uncomment next line to enable persisting of state
  // { src: '~/plugins/persist-state', ssr: false },
  { src: '~/plugins/resize-directive', ssr: false },
  { src: '~/plugins/vue-material.js', ssr: true },
  { src: '~/plugins/vue-portal', ssr: true },
  { src: '~/plugins/vue-slider-component', ssr: false }
]
