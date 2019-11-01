/**
 * Persist and rehydrate app state between page loads
 * @see https://github.com/robinvdvleuten/vuex-persistedstate#nuxtjs
 */
import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  createPersistedState({
      key: 'app-state',
      paths: [
        'hazards',
        'mapbox.features',
        'mapbox.selections',
        'results'
      ],
  })(store)
}
