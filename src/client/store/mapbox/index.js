import { NETHERLANDS_CENTER_LATITUDE, NETHERLANDS_CENTER_LONGITUDE, MAP_ZOOM } from '../../lib/_mapbox/map-config'

export const state = () => ({
  mapObject: {},
  eventHandlers: {},
  mapIsLoaded: false
})

export const mutations = {
  addEventHandler(state, { event, handler }) {
    state.eventHandlers = { ...state.eventHandlers, [event]: handler }
  },
  initMap(state, map) {
    state.mapObject = Object.freeze({ map })
  },
  removeEventHandler(state, event) {
    const handler = state.eventHandlers[event]

    if(handler) {
      state.eventHandlers = { ...state.eventHandlers, [event]: undefined }
    }
  },
  setMapIsLoaded(state, loaded) {
    state.mapIsLoaded = loaded
  }
}

export const actions = {
  addEventHandler({ state, commit }, { event, handler }) {
    state.mapObject.map.on(event, handler)
    commit('addEventHandler', { event, handler })
  },
  addOnceEventHandler({state }, { event, handler }) {
    state.mapObject.map.once(event, handler)
  },
  initMap({ commit }, map) {
    map.on('load', () => {
      commit('setMapIsLoaded', true)
      commit('initMap', map)
    })
  },
  moveMapToCenter({ state }) {
    state.mapObject.map.flyTo({
      center:[ NETHERLANDS_CENTER_LONGITUDE, NETHERLANDS_CENTER_LATITUDE ],
      zoom: MAP_ZOOM
    })
  },
  removeEventHandler({ state, commit }, { event }) {
    const handler = state.eventHandlers[event]

    if(handler) {
      state.mapObject.map.off(event, handler)
      commit('removeEventHandler', event)
    }
  }
}

export const getters = {
  map(state) {
    if(state.mapObject.map) {
      return state.mapObject.map
    }
  }
}
