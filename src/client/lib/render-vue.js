import Vue from 'vue'

/**
 * Renders a Vue component to an HTML element.
 * This function lets us write components in Vue, which we then can render to HTMLElements when we need this.
 * @param {Vue.Component} baseComponent - The Vue component that we want to render.
 * @param {Object} propsData - The props to pass to the Vue component.
 * @returns {HTMLElement}
 */
export default function (baseComponent, propsData) {
  let Component = Vue.extend(baseComponent)
  let instance = new Component({ propsData })

  return instance.$mount().$el
}
