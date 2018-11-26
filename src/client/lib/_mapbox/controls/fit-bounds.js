import container from './container'

import { FitboundsControl } from '../../../components'

export default class BaseLayerControl {
  onAdd(map) {
    this._map = map
    this._container = container(FitboundsControl, { fitToBounds: this.fitToBounds.bind(this) })
    this._container.className = `${this._container.className} mapboxgl-ctrl`

    return this._container
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container)
    this._map = undefined;
  }

  fitToBounds() {
    this._map.fire('fitbounds', undefined)
  }
}
