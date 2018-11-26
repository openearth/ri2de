/**
 * @see https://nuxtjs.org/api/configuration-plugins
 */
module.exports = [
  { src: '~/plugins/persist-state', ssr: false },
  { src: '~/plugins/resize-directive', ssr: false },
  { src: '~/plugins/vue-portal', ssr: true },
]
