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
  updateClasses(state, { hazardIndex, susceptibilityIndex, classes }) {
    const newFactors = [ ...state.susceptibilityFactors ]
    if (newFactors[hazardIndex][susceptibilityIndex].classes) {
      newFactors[hazardIndex][susceptibilityIndex].classes = [ ...classes ]
    }
    newFactors[hazardIndex][susceptibilityIndex].weightFactor = 1
    state.susceptibilityFactors = newFactors
  },
  resetSusceptibilityFactors(state) {
    const newFactors = [ ...state.susceptibilityFactors ]
    newFactors[state.selectedHazardIndex].forEach(factor => factor.classes = [...factor.initialClasses])
    state.susceptibilityFactorS = newFactors
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
  resetSusceptibilityFactors({ commit, dispatch, state, rootState }) {
    const selections = rootState.mapbox.selections.selections
    const selectionPolygons = selections.map(selection => selection.polygon[0])
    const currentFactors = state.susceptibilityFactors[state.selectedHazardIndex]

    currentFactors.forEach(async (factor, index) => {
      const factorLayers = selectionPolygons.map(async polygon => {
        const wmsLayer = await wmsSelectionFromFactor({ factor, polygon })
        dispatch('mapbox/wms/remove', wmsLayer.id, { root: true })
      })

      try {
        commit('updateFactorLayers', {
          index,
          factorLayers: await Promise.all(factorLayers)
        })
      } catch(e) {
        console.log('Error: ', e)
      }
    })

    dispatch('resetSusceptibilityFactors')
  },
}

export const getters = {
  currentSusceptibilityFactors({ selectedHazardIndex, susceptibilityFactors }) {
    return susceptibilityFactors[selectedHazardIndex]
  },
}
