import FileSaver from 'file-saver'
import getLoadedFileContents from '../lib/get-loaded-file-contents'

export const state = () => ({
  activePage: 'index',
  completed: {
    infrastructure: false,
    hazards: false,
  }
})

export const mutations = {
  setActivePage(state, page) {
    state.activePage = page
  },
}

export const actions = {
  async importProject({ commit, dispatch }) {
    const loadedProject = await getLoadedFileContents(event)
    const { selections } = loadedProject.mapbox.selections
    const { features } = loadedProject.mapbox
    const { selectedHazardIndex, hazards } = loadedProject.hazards

    if (!selections && !features) {
      throw new Error()
    }

    dispatch('restartApp')

    // add selections to state
    selections
      .forEach(selection => commit('mapbox/selections/add', selection))

    // draw the selections
    selections
      .map(selection => selection.polygon)
      .forEach(selection => dispatch('mapbox/selections/draw', selection))

    // zoom in to the added features
    dispatch('mapbox/selections/fitToFeatures')

    if (features) {
      features
        .forEach(feature => dispatch('mapbox/features/add', feature))
    }

    if (hazards) {
      commit('hazards/setHazards', hazards)
    }

    if (selectedHazardIndex) {
      commit('hazards/selectHazard', selectedHazardIndex )
    }

    // redirect to the right page after the import is done
    if (selectedHazardIndex) {
      return 'susceptibilities'
    } else {
      return 'hazards'
    }
  },
  saveProject ({ state }) {
    const project = {
      hazards: state.hazards,
      mapbox: {
        selections: state.mapbox.selections,
        features: state.mapbox.features.features
      }
    }
    const title = 'ri2de_project'
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' })
    FileSaver.saveAs(blob, `${title}.json`)
  },
  restartApp({ commit, dispatch}) {
    dispatch('mapbox/wms/resetLayers')
    dispatch('mapbox/features/resetFeatures')
    dispatch('mapbox/selections/reset')
    dispatch('mapbox/moveMapToCenter')
    dispatch('susceptibility-layers/reset')
    commit('hazards/reset')
  }
}
