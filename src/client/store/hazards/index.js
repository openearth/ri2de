import wps from '../../lib/wps'

export const state = () => ({
  hazards: [],
  selectedHazardIndex: null,
  susceptibilityFactors: [],
  bufferDist:120,
  segmentLength:1000,
  riskClasses:[0,1.5,2,3]
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
  updateBufferDist(state, bufferDist) {
    state.bufferDist = Number(bufferDist)
  },
  updateSegmentLength(state, segmentLength){
    state.segmentLength = Number(segmentLength)
  },
  updateRiskClasses(state, riskclasses){
    state.riskClasses = riskclasses
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
  updateFactorLayer(state,{hazardIndex, susceptibilityIndex, layer }){
    const newFactors = [ ...state.susceptibilityFactors ]
    newFactors[hazardIndex][susceptibilityIndex].owsUrl = layer.owsurl
    newFactors[hazardIndex][susceptibilityIndex].layerName = layer.layername
    state.susceptibilityFactors = newFactors

  },
  
  reset(state) {
    state.selectedHazardIndex = null
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
    state.susceptibilityFactors && state.susceptibilityFactors.length
        ? state.susceptibilityFactors
        : hazardsList.map(
          ({ layers }) => layers.map(
            (layer, index) => ({ ...layer, weightFactor: 1, visible: index === 0 ? true : false  })
          )
        )
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
