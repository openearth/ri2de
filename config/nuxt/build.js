/**
 * @see https://nuxtjs.org/api/configuration-build
 */
module.exports = {
  /*
  ** You can extend webpack config here
  */
  extend(config, ctx) {
    // Run ESLint on save
    if (ctx.isDev && ctx.isClient) {
      config.module.rules.push({
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /(node_modules)/
      })
    }
  }
}
