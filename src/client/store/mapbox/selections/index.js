export const state = () => ({
  selections: [],
})

export const mutations = {
  add(state, selection) {
    state.selections = [ ...state.selections, selection ]
  },
  remove(state, selectionId) {
    state.selections = state.selections.filter(selection => selection.id !== selectionId)
  },
  reset(state) {
    state.selections = []
  },
}

export const actions = {
  delete({ commit, rootGetters }, selectionId) {
    const map = rootGetters['mapbox/map']
    map.__draw.delete(selectionId)

    commit('remove', selectionId)
  },
  draw({ commit, rootGetters }, selection) {
    const map = rootGetters['mapbox/map']
    map.__draw.add(selection)
  },
  reset({ commit }) {
    commit('reset')
  },
}
