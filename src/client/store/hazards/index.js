import wps from '../../lib/wps'

export const state = () => ({
  hazards: [],
  selectedHazardIndex: 0,
  susceptibilityFactors: [],
})

export const mutations = {
  addHazard(state, hazard) {
    state.hazards = [ ...state.hazards, hazard ]
  },
  addSusceptibilityFactor(state, susceptibilityFactor) {
    state.susceptibilityFactors = [ ...state.susceptibilityFactors, susceptibilityFactor ]
  },
  selectHazard(state, index) {
    state.selectedHazardIndex = index
  },
  setHazards(state, hazards) {
    state.hazards = hazards
  },
  addSusceptibilityFactorForCurrentHazard(state, susceptibilityFactor) {
    const newFactors = [ ...state.susceptibilityFactors ]
     newFactors[state.selectedHazardIndex] = [
      ...newFactors[state.selectedHazardIndex],
      susceptibilityFactor
    ]

     state.susceptibilityFactors = newFactors
  },
  setSusceptibilityFactors(state, susceptibilityFactors) {
    state.susceptibilityFactors = susceptibilityFactors
  },
  updateClasses(state, { hazardIndex, susceptibilityIndex, classes }) {
    const newFactors = [ ...state.susceptibilityFactors ]
    newFactors[hazardIndex][susceptibilityIndex].classes = [ ...classes ]

    state.susceptibilityFactors = newFactors
  },
  updateFactorLayers(state, { hazardIndex, factorLayers, index }) {
    const newFactors = [ ...state.susceptibilityFactors ]
    newFactors[hazardIndex][index].factorLayers = factorLayers

    state.susceptibilityFactors = newFactors
  },
  updateFactorVisibility(state, { hazardIndex, index, visible }) {
    const newFactors = [ ...state.susceptibilityFactors ]
    newFactors[hazardIndex][index].visible = visible

    state.susceptibilityFactors = newFactors
  },
  updateWeightFactor(state, { hazardIndex, susceptibilityIndex, weightFactor }) {
    const newFactors = [ ...state.susceptibilityFactors ]
    newFactors[hazardIndex][susceptibilityIndex].weightFactor = Number(weightFactor)

    state.susceptibilityFactors = newFactors
  },
  reset(state) {
    state.selectedHazardIndex = 0
    state.susceptibilityFactors = state.susceptibilityFactors.map(susceptibilityFactor =>
      susceptibilityFactor
        .filter(layer => !layer.isCustom)
        .map(layer => ({
          ...layer,
          weightFactor: 1
        }))
    )
  },
}

export const actions = {
  async bootstrapHazards({ commit, state }) {
    const hazardsList = await wps({ functionId: 'ri2de_calc_init' })
    const hazards = hazardsList.map(({ name }) => ({ name, title: name, id: name }))

    commit('setHazards', hazards)

    commit('setSusceptibilityFactors',
    state.susceptibilityFactors
        ? state.susceptibilityFactors
        : hazardsList.map(({ layers }) => layers.map(layer => ({ ...layer, weightFactor: 1, visible: false })) )
    )
  },
  async addSusceptibilityFactor({ commit }, newLayer) {
    commit('addSusceptibilityFactorForCurrentHazard', {
      ...newLayer,
      weightFactor: 1,
      visible: true,
      wpsFunctionId: 'ri2de_calc_custom',
    })
  }
}

export const getters = {
  currentSusceptibilityFactors({ selectedHazardIndex, susceptibilityFactors }) {
    return susceptibilityFactors[selectedHazardIndex]
  },
  currentSusceptibilityWeightsByTitle({ selectedHazardIndex, susceptibilityFactors }) {
    const currentSusceptibilityFactors = susceptibilityFactors[selectedHazardIndex]
    if(currentSusceptibilityFactors) {
      return susceptibilityFactors[selectedHazardIndex]
        .reduce((weights, factor) => ({ ...weights, [factor.title]: factor.weightFactor }), {})
    } else {
      return {}
    }
  },
}
