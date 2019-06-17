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
    const { selectedHazardIndex, hazards } = loadedProject.hazards

    selections.forEach(selection => {
      commit('mapbox/selections/add', selection)
    })

    selections
      .map(selection => selection.polygon)
      .forEach(selection => {
        dispatch('mapbox/selections/draw', selection)
      })

    dispatch('mapbox/selections/fitToFeatures')

    commit('hazards/setHazards', hazards)

    if (selectedHazardIndex) {
      commit('hazards/selectHazard', selectedHazardIndex )
    }

  },
  saveProject ({ state }) {
    const project = {
      hazards: state.hazards,
      mapbox: {
        selections: state.mapbox.selections
      }
    }
    const title = 'ri2de_project'
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' })
    FileSaver.saveAs(blob, `${title || 'ri2de_project'}.json`)
  }
}
