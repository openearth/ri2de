import { MapboxDraw } from '../_mapbox'

export default function(map) {
  return new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        polygon: true,
    },
    modes: { ...MapboxDraw.modes, static: StaticMode },
    defaultMode: 'simple_select',
  })
}

const drawButtonClass = '.mapbox-gl-draw_ctrl-draw-btn'
const StaticMode = {
  onSetup() {
    const drawButton = document.querySelector(drawButtonClass)

    if(drawButton) {
      drawButton.setAttribute('disabled', true)
    }

    this.setActionableState() // default actionable state is false for all actions

    return {}
  },
  onStop() {
    const drawButton = document.querySelector(drawButtonClass)

    if(drawButton) {
      drawButton.removeAttribute('disabled')
    }
  },
  toDisplayFeatures(state, geojson, display) {
    display(geojson)
  }
}
