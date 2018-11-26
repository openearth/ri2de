import container from './container'

import { BaselayerControl } from '../../../components'

export default class BaseLayerControl {
  constructor(layers) {
    this._layers = layers
  }

  onAdd(map) {
    this._map = map
    this._container = container(BaselayerControl, {
      switchHandler: this.switchLayer.bind(this),
      layers: this._layers,
    })
    this._container.className = `${this._container.className} mapboxgl-ctrl`

    return this._container
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container)
    this._map = undefined
  }

  switchLayer(style) {
    this._map.setStyle(style)
  }
}
