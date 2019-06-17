// import { stringify } from 'flatted'
import FileSaver from 'file-saver'

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
  }
}

export const actions = {
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
