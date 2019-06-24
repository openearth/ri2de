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
    newFactors[hazardIndex][susceptibilityIndex].classesValue = [ ...classes ]

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
    state.selectedHazardIndex = undefined
    state.susceptibilityFactors = state.susceptibilityFactors.map(susceptibilityFactor =>
      susceptibilityFactor
        .filter(layer => !layer.isCustom)
        .map(layer => ({
          ...layer,
          classesValue: layer.classes,
          weightFactor: 1
        }))
    )
  },
}

export const actions = {
  async bootstrapHazards({ commit, state }) {
    const hazardsList = await wps({ functionId: 'ri2de_calc_init' })
    const hazards = hazardsList.map(({ name }) => ({ name, title: name, id: name }))

    const susceptibilityFactors = hazardsList.map(({ layers }, hazardIndex) => {
      const hazard = state.susceptibilityFactors[hazardIndex]
      // get current custom layers from state
      const customLayers = hazard ? hazard.filter(layer => layer.isCustom) : []

      // merge custom layers with layers from wps()
      return [...layers, ...customLayers]
        .map((layer, layerIndex) => {
          const layerInState = hazard && hazard[layerIndex]
          const match = layerInState && layerInState.layerName === layer.layerName

          // get values from saved state if they are available
          const weightFactor = match ? layerInState.weightFactor : layer.weightFactor
          const classesValue = match && layerInState.classesValue ? layerInState.classesValue : layer.classes
          const visible = match ? layerInState.visible : layer.visible

          return {
            ...layer,
            classesValue,
            weightFactor,
            visible
          }
        })
    })

    commit('setHazards', hazards)
    commit('setSusceptibilityFactors', susceptibilityFactors)
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
