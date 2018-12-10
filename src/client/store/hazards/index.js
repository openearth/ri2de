import wps from '../../lib/wps'
import { wmsSelectionFromFactor } from '../../lib/project-layers'

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
  updateClasses(state, { hazardIndex, susceptibilityIndex, classes }) {
    const newFactors = [ ...state.susceptibilityFactors ]
    if (newFactors[hazardIndex][susceptibilityIndex].classes) {
      newFactors[hazardIndex][susceptibilityIndex].classes = [ ...classes ]
    }
    state.susceptibilityFactors = newFactors
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
    const susceptibilityFactors = hazardsList.map(({ layers }) => layers.map(layer => ({ ...layer, weightFactor: 1, initialClasses: [...layer.classes] })) )

    commit('setHazards', hazards)
    commit('setSusceptibilityFactors', susceptibilityFactors)
  },
  resetSusceptibilityFactors({ commit, dispatch, state }) {
    const { susceptibilityFactors, selectedHazardIndex } = state
    const currentFactors = susceptibilityFactors[selectedHazardIndex]

    currentFactors.forEach((factor, index) => {
      if(factor.factorLayers) {
        factor.factorLayers.forEach(layer => {
          dispatch('mapbox/wms/remove', layer, { root: true })
        })
      }

      commit('updateClasses', {
        hazardIndex: selectedHazardIndex,
        susceptibilityIndex: index,
        classes: [ ...factor.initialClasses ],
      })
      commit('updateWeightFactor', {
        hazardIndex: selectedHazardIndex,
        susceptibilityIndex: index,
        weightFactor: 1,
      })
    })
  },
}

export const getters = {
  currentSusceptibilityFactors({ selectedHazardIndex, susceptibilityFactors }) {
    return susceptibilityFactors[selectedHazardIndex]
  },
  factors: state => index => {
    console.log(state.susceptibilityFactors)
    console.log(index)
    return state.susceptibilityFactors[index]
  },
}
