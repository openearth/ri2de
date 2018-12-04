export const state = () => ({
  layers: [],
})

export const mutations = {
  add(state, layer) {
    if(!state.layers.some(storedLayer => storedLayer.id == layer.id)) {
      state.layers = [ ...state.layers, layer ]
    }
  },
  remove(state, id) {
    state.layers = state.layers.filter(layer => layer.id !== id)
  },
  resetLayers(state) {
    state.layers = []
  }
}

export const actions = {
  add({ commit, rootGetters }, layer) {
    const map = rootGetters['mapbox/map']

    if(!map.getLayer(layer.id)) {
      map.addLayer(layer)
      commit('add', layer)
    }
  },
  setOpacity({ rootGetters }, { id, opacity }) {
    const map = rootGetters['mapbox/map']

    if(map.getLayer(id)) {
      map.setPaintProperty(id, 'raster-opacity', opacity)
    }
  },
  remove({ commit, rootGetters }, id) {
    const map = rootGetters['mapbox/map']

    if(map.getLayer(id)) {
      map.removeLayer(id)
      map.removeSource(id)
      commit('remove', id)
    }
  },
  resetLayers({ commit, rootGetters, state }, id) {
    const map = rootGetters['mapbox/map']

    state.layers.forEach(({ id }) => {
      if(map.getLayer(id)) {
        map.removeLayer(id)
        map.removeSource(id)
      }
    })

    commit('resetLayers')
  }
}
