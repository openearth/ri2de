/**
 * @see https://nuxtjs.org/api/configuration-plugins
 */
module.exports = [
  { src: '~/plugins/persist-state', ssr: false },
  { src: '~/plugins/resize-directive', ssr: false },
  { src: '~/plugins/vue-material.js', ssr: true },
  { src: '~/plugins/vue-portal', ssr: true },
]
