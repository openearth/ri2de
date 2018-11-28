export const state = () => ({
  activePage: 'index',
  selectedHazardIndex: undefined,
  completed: {
    infrastructure: false,
    hazards: false,
  }
})

export const mutations = {
  selectHazard(state, index) {
    state.selectedHazardIndex = index
  },
  setActivePage(state, page) {
    state.activePage = page
  }
}
