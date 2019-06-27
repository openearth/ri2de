import bbox from '@turf/bbox'
import { featureCollection } from '@turf/helpers'

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
  updateTitle(state, { selectionId, title }) {
    state.selections = state.selections.map(item => {
      if (item.id === selectionId) {
        return { ...item, title: title }
      }

      return { ...item }
    })
  }
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
  fitToFeatures({ state, rootGetters }) {
    const map = rootGetters['mapbox/map']
    const { selections } = state

    if(!selections.length) {
      return
    }

    const bounds = bbox(
      featureCollection(
        selections.map(selection => selection.polygon)
      )
    )

    map.fitBounds(bounds, { padding: 50 })
  },
  hideAll({ state, rootGetters }) {
    const map = rootGetters['mapbox/map']

    state.selections
      .forEach(selection => map.__draw.delete(selection.id))
  },
  reset({ commit, state, rootGetters }) {
    const map = rootGetters['mapbox/map']

    state.selections
      .forEach(selection => map.__draw.delete(selection.id))

    commit('reset')
  },
  setMode({ rootGetters }, mode) {
    const map = rootGetters['mapbox/map']
    if (map) {
      map.__draw.changeMode(mode)
    }
  },
  showAll({ state, rootGetters }) {
    const map = rootGetters['mapbox/map']

    state.selections
      .forEach(selection => map.__draw.add(selection))
  }
}

export const getters = {
  selectionsToRoadIds(state) {
    return state.selections.reduce((selectionMap, selection) => {
      return { ...selectionMap, [selection.id]: selection.identifier }
    }, {})
  }
}
