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
      susceptibilityFactor.map(layer => ({
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

    const susceptibilityFactors = hazardsList.map(({ layers }, HazardIndex) =>
      layers
        .map((layer, LayerIndex) => {
          const hazard = state.susceptibilityFactors[HazardIndex]
          const layerInState = hazard && hazard[LayerIndex]
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
    )

    commit('setHazards', hazards)
    commit('setSusceptibilityFactors', susceptibilityFactors)
  },
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
