export const state = () => {
  return {
    layersPerSelection: {},
    totalsLayers: []
  }
}

export const mutations = {
  addLayerToSelection(state, { layer, selectionId }) {
    state.layersPerSelection = {
      ...state.layersPerSelection,
      [ selectionId ]: {
        ...state.layersPerSelection[selectionId],
        [ layer.id ]: layer
      }
    }
  },
  addTotalsLayer(state, layer) {
    state.totalsLayers = [
      ...state.totalsLayers,
      layer
    ]
  },
  resetLayersPerSelection(state) {
    state.layersPerSelection = {}
  },
  resetTotalsLayers(state) {
    state.totalsLayers = []
  }
}

export const actions = {
  reset({ commit }) {
    commit('resetLayersPerSelection')
    commit('resetTotalsLayers')
  }
}
