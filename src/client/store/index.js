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
