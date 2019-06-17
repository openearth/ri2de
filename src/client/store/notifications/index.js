export const state = () => ({
  messages: [],
})

export const mutations = {
  add(state, { message, duration, type, id }) {
    state.messages.push({
      id,
      message,
      duration,
      type,
    })
  },

  remove(state, id) {
    const notification = state.messages.find(item => item.id === id)
    const index = state.messages.indexOf(notification)
    state.messages.splice(index, 1)
  },
}

export const actions = {
  showNotification({ commit }, { message, duration, type }) {
    const id = Date.now().toString()
    commit('add', { message, duration, type, id })

    if (duration > 0) {
      setTimeout(() => { commit('remove', id) }, duration)
    }
    return id
  },

  async showWarning({ dispatch }, { message, duration = 4000 }) {
    return await dispatch('showNotification', { message, duration, type: 'warning' })
  },

  async showError({ dispatch }, { message, duration = 4000 }) {
    return await dispatch('showNotification', { message, duration, type: 'error' })
  },
}
