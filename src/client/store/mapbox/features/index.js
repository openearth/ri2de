import bbox from '@turf/bbox'
import { featureCollection } from '@turf/helpers'

export const state = () => ({
  eventHandlers: {},
  features: [],
  riskFeatures:[],
})

export const mutations = {
  add(state, feature) {
    if(!state.features.some(storedFeature => storedFeature.id == feature.id)) {
      state.features = [ ...state.features, feature ]
    }
  },
  addRiskFeatures(state, features){
    if(!state.riskFeatures.some(storedFeature => storedFeature.id == features.id)) {
      state.riskFeatures = [ ...state.riskFeatures, features ]
    }
 
  },
  updateRiskFeatures(state, classes){
    if (state.riskFeatures.length) {
      const newfeatures = state.riskFeatures.map(feature =>{
          
          const riskfeatures = feature.source.data.features
          riskfeatures.forEach(riskfeature => {
            if (riskfeature.properties.mean >= classes[0] && riskfeature.properties.mean < classes[1]) { 
              riskfeature.properties.color = "#89fa32"
            } else if (riskfeature.properties.mean >= classes[1] && riskfeature.properties.mean < classes[2]) {
              riskfeature.properties.color ="#fff565"
            } else {
              riskfeature.properties.color ="#ff0000"
            } 
  
          })     
          return feature})
       
      state.riskFeatures = newfeatures 
    }  
     
  },
  
  addEventHandler(state, { id, event, handler }) {
    state.eventHandlers = {
      ...state.eventHandlers,
      [ id ]: {
        ...state.eventHandlers[id],
        [ event ]: handler
      }
    }
  },
  remove(state, id) {
    state.features = state.features.filter(feature => feature.id !== id)
  },
  removeEventHandler(state, { event, featureId }) {
    const featureEventHandlers = state.eventHandlers[featureId]

    state.eventHandlers = {
      ...state.eventHandlers,
      [ featureId ]: {
        ...featureEventHandlers,
        [ event ]: undefined
      }
    }
  },
  resetFeatures(state) {
    state.features = []
  },
  resetRiskFeatures(state){
    state.riskFeatures = []
  }
}

export const actions = {
  addRiskFeatures({ commit, rootGetters }, features){
    const map = rootGetters['mapbox/map']
    map.addLayer(features)
    commit('addRiskFeatures', features)
  },
  resetRiskFeatures({ commit, state, rootGetters }) {
    const map = rootGetters['mapbox/map']

    state.riskFeatures.forEach(feature => {
      map.removeLayer(feature.id)
      map.removeSource(feature.id)
    })
    
    commit('resetRiskFeatures')
  },

  updateRiskFeatures({commit, state, rootGetters}, classes) {
    const map = rootGetters['mapbox/map']
    commit('updateRiskFeatures', classes)
    state.riskFeatures.forEach(feature => {
     if(map.getLayer(feature.id)){
        map.removeLayer(feature.id)
        map.removeSource(feature.id)
        map.addLayer(feature)
        
      }
    })
    },
  add({ commit, rootGetters }, feature) {
    const map = rootGetters['mapbox/map']

    if(!map.getLayer(feature.id)) {
      map.addLayer(feature)
      commit('add', feature)
    }
  },
  addEventHandler({ commit, rootGetters }, { id, event, handler }) {
    const map = rootGetters['mapbox/map']

    map.on(event, id, handler)
    commit('addEventHandler', { id, event, handler })
  },
  fitToFeatures({ state, rootGetters }) {
    const map = rootGetters['mapbox/map']
    const { features } = state

    if(!features.length) {
      return
    }

    const bounds = bbox(
      featureCollection(
        features.map(feature => ({
          geometry: feature.source.data,
          type: 'Feature'
        }))
      )
    )

    map.fitBounds(bounds, { padding: 50 })
  },
  resetFeatures({ commit, state, rootGetters }) {
    const map = rootGetters['mapbox/map']

    state.features.forEach(({ id }) => {
      if(map.getLayer(id)) {
        map.removeLayer(id)
        map.removeSource(id)
      }
    })

    commit('resetFeatures')
  },
  setStyle({ rootGetters }, { id, styleOption ,value }) {
    const map = rootGetters['mapbox/map']

    if(map && map.getLayer(id)) {
      map.setPaintProperty(id, styleOption, value)
    }
  },
  remove({ commit, rootGetters }, id) {
    const map = rootGetters['mapbox/map']

    if(map.getLayer(id)) {
      map.removeLayer(id)
      map.removeSource(id)
      commit('remove', id)
    }
  },
  removeEventHandler({ commit, rootGetters, state }, { event, featureId }) {
    const map = rootGetters['mapbox/map']

    map.off(event, featureId, state.eventHandlers[featureId][event])
    commit('removeEventHandler', { event, featureId })
  }
  
}
