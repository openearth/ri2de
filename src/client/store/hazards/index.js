import wps from '../../lib/wps'

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
  updateFactorLayers(state, { factorLayers, index }) {
    const { selectedHazardIndex, susceptibilityFactors } = state
    const newFactor = {
      ...susceptibilityFactors[selectedHazardIndex][index],
      factorLayers,
    }

    susceptibilityFactors[selectedHazardIndex][index] = newFactor
  },
  updateWeightFactor(state, { hazardIndex, susceptibilityIndex, weightFactor }) {
    const newFactors = [ ...state.susceptibilityFactors ]
    newFactors[hazardIndex][susceptibilityIndex].weightFactor = Number(weightFactor)
    state.susceptibilityFactors = newFactors
  }
}

export const actions = {
  async bootstrapHazards({ commit }) {
    const wpsResponse = await wps({ functionId: 'ri2de_calc_init' })
    const hazardsList = wpsResponse.data
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
