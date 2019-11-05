import { selectionToCustomFactorLayer, generateWmsLayer } from './project-layers'

const getSelectionLayers = async (store) => {
  const currentSusceptibilityFactors = store.getters['hazards/currentSusceptibilityFactors']

  if (currentSusceptibilityFactors) {
    const selections = store.state.mapbox.selections.selections
    currentSusceptibilityFactors.forEach(async (factor, index) => {
      const factorLayers = selections.map(async selection => {
        const customFactorLayer = await selectionToCustomFactorLayer({ polygon: selection.polygon, factor, identifier: selection.identifier })
        const wmsLayer = generateWmsLayer(customFactorLayer)

        store.dispatch('mapbox/wms/add', {
          ...wmsLayer,
          paint: { 'raster-opacity': index === 0 ? 1 : 0 },
        })
        store.commit('susceptibility-layers/addLayerToSelection', {
          selectionId: selection.id,
          layer: { ...customFactorLayer, susceptibility: factor.title },
        })

        return wmsLayer.id
      })
      console.log(factorLayers)

      try {
        const hazardIndex = store.state.hazards.selectedHazardIndex
        console.log(hazardIndex)
        store.commit('hazards/updateFactorLayers', {
          index, hazardIndex, factorLayers: await Promise.all(factorLayers)
        })
      } catch(e) {
        // this.errorMessage = 'Error fetching the layers, reload and try again'
        // this.errorCalculatingSusceptibilityLayers = true
        console.log('Error: ', e)
      }

      if(currentSusceptibilityFactors && index === currentSusceptibilityFactors.length - 1) {
        // this.calculatingSusceptibilityLayers = false
      }
    })
  }
  else {
    // this.calculatingSusceptibilityLayers = false
  }
}

export default getSelectionLayers
