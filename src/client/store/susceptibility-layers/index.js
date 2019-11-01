export const state = () => {
  return {
    layersPerSelection: {},
    totalsLayers: [],
    LayersForRisk:[],
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
  addLayersForRisk(state, layer) {
    state.LayersForRisk = [
      ...state.LayersForRisk,
      layer
    ]

  },
  resetLayersPerSelection(state) {
    state.layersPerSelection = {}
  },
  resetTotalsLayers(state) {
    state.totalsLayers = []
  },
  resetLayersForRisk(state){
    state.LayersForRisk = []
  },
}

export const actions = {
  reset({ commit }) {
    commit('resetLayersPerSelection')
    commit('resetTotalsLayers')
  },
  resetLayersForRisk({commit}){
    commit('resetLayersForRisk')
  }
}
