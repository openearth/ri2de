import { MapboxDraw } from '../_mapbox'

export default function(map) {
  return new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        polygon: true,
    }
  })
}

const hiddenMode = {
  onSetup(opts) {
    console.log('SETUP', )
    return state;
  },
  toDisplayFeatures(state, geojson, display) {
    display(geojson);
  },
}
