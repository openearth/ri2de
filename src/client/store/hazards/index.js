const { getHazards, getSusceptibilityFactors } = require('~/lib/mock-api')

export const state = () => ({
  hazards: [],
})

export const mutations = {
  addHazard(state, hazard) {
    state.hazards = [ ...state.hazards, hazard ]
  },
  updateWeightFactor(state, { hazardTitle, susceptibilityFactorTitle, weightFactor }) {
    state.hazards = state.hazards.map(hazard => {
      if (hazard.title === hazardTitle) {
        const updatedSusceptibilityFactor = { ...hazard.susceptibilityFactors[susceptibilityFactorTitle], weightFactor: Number(weightFactor) }

        return {
          ...hazard,
          susceptibilityFactors: {
            ...hazard.susceptibilityFactors,
            [susceptibilityFactorTitle]: updatedSusceptibilityFactor,
          }
        }
      }

      return { ...hazard }
    })
  }
}

export const actions = {
  bootstrapHazards({ commit }) {
    const hazardsList = getHazards()

    hazardsList.forEach(hazard => {
      const susceptibilityFactorsList = getSusceptibilityFactors(hazard.title).layers
      const susceptibilityFactors = susceptibilityFactorsList.reduce((obj, factor) => {
        obj[factor.title] = { ...factor, min: 0, max: 1, step: 0.1 }
        return obj
      }, {})

      commit('addHazard', { ...hazard, susceptibilityFactors })
    })
  },
}
