import { getHazards } from '~/lib/mock-api'

export const state = () => ({
  hazards: [],
  selectedHazardIndex: undefined,
  susceptibilityFactors: [],
})

export const mutations = {
  addHazard(state, hazard) {
    state.hazards = [ ...state.hazards, hazard ]
  },
  addSusceptibilityFactors(state, susceptibilityFactors) {
    state.susceptibilityFactors = [ ...state.susceptibilityFactors, susceptibilityFactors ]
  },
  selectHazard(state, index) {
    state.selectedHazardIndex = index
  },
  setHazards(state, hazards) {
    state.hazards = hazards
  },
  setSusceptibilityFactors(state, susceptibilityFactors) {
    state.susceptibilityFactors = susceptibilityFactors
  },
  updateWeightFactor(state, { hazardIndex, susceptibilityIndex, weightFactor }) {
    const newFactors = [ ...state.susceptibilityFactors ]
    newFactors[hazardIndex][susceptibilityIndex].weightFactor = Number(weightFactor)
    state.susceptibilityFactors = newFactors
  }
}

export const actions = {
  bootstrapHazards({ commit }) {
    const hazardsList = getHazards()
    const hazards = hazardsList.map(({ name }) => ({ name, title: name, id: name }))
    const susceptibilityFactors = hazardsList.map(({ layers }) => layers.map(layer => ({ ...layer, weightFactor: 1 })) )

    commit('setHazards', hazards)
    commit('setSusceptibilityFactors', susceptibilityFactors)
  },
}

export const getters = {
  currentSusceptibilityFactors({ selectedHazardIndex, susceptibilityFactors }) {
    return susceptibilityFactors[selectedHazardIndex]
  }
}
