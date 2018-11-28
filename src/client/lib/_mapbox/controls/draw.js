import { MapboxDraw } from '../_mapbox'
import StaticMode from '@mapbox/mapbox-gl-draw-static-mode'

export default function(map) {
  return new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        polygon: true,
    },
    modes: { ...MapboxDraw.modes, static: StaticMode }
  })
}
