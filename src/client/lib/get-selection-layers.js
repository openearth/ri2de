import { selectionToCustomFactorLayer, generateWmsLayer } from './project-layers'

const getSelectionLayers = async (store) => {
  const currentSusceptibilityFactors = store.getters['hazards/currentSusceptibilityFactors']

  if(!currentSusceptibilityFactors) return

  const selections = store.state.mapbox.selections.selections
  const buildResults = await Promise.all(currentSusceptibilityFactors.map(async (factor, index) => {
    const factorLayers = selections.map(async selection => {
      const customFactorLayer = await selectionToCustomFactorLayer({
        polygon: selection.polygon,
        factor,
        indentifier: selection.identifier
      })
      const wmsLayer = generateWmsLayer(customFactorLayer)

      store.dispatch('mapbox/wms/add', {
        ...wmsLayer,
        paint: {
          'raster-opacity': index === 0 ? 1 : 0
        }
      })
      store.commit('susceptibility-layers/addLayerToSelection', {
        selectionId: selection.id,
        layer: {
          ...customFactorLayer,
          susceptibility: factor.title
        }
      })

      return wmsLayer.id
    })

    try {
      const hazardIndex = store.state.hazards.selectedHazardIndex
      store.commit('hazards/updateFactorLayers', {
        index,
        hazardIndex,
        factorLayers: await Promise.all(factorLayers)
      })
    }
    catch(e) {
      return e
    }
  }))

  const buildError = buildResults.find(res => res instanceof Error)
  if(buildError) throw buildError
  return
}

export default getSelectionLayers
