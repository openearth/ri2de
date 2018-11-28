import { MapboxDraw } from '../_mapbox'

export default function(map) {
  return new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        polygon: true,
    }
  })
}
