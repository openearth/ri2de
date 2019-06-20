import geoserverUrl from './geoserver-url'
import layers from './_mapbox/layers'
import wps from './wps'

export const generateWmsLayer = ({ url, id, layer, style='', paint={} }) => {
  const tile = geoserverUrl({
    url,
    service: 'WMS',
    request: 'GetMap',
    layers: layer,
    style,
    width: 256,
    height: 256,
    srs: 'EPSG:3857',
    transparent: true,
    bbox: '{bbox-epsg-3857}',
    format: 'image/png',
    encode: false
  })

  return layers.wms({
    id,
    tiles: [ tile ],
    tileSize: 256,
    paint
  })
}

export async function selectionToCustomFactorLayer({ factor, polygon, identifier }) {
  const wpsResponse = await wps({
    functionId: factor.wpsFunctionId,
    requestData: {
      classes: factor.classes,
      layername: factor.layerName,
      owsurl: factor.owsUrl,
    },
    polygon,
    roadsIdentifier: identifier,
  })

  if (wpsResponse.errMsg) {
    throw new Error(wpsResponse.errMsg)
  } else {
    const { baseUrl, layerName, style } = wpsResponse

    return {
      style,
      id: `${polygon.id}-${factor.title}`,
      layer: layerName,
      url: baseUrl,
    }
  }
}

export async function wmsSelectionFromFactor({ factor, polygon, identifier }) {
  const wpsResponse = await wps({
    functionId: factor.wpsFunctionId,
    requestData: {
      classes: factor.classes,
      layername: factor.layerName,
      owsurl: factor.owsUrl,
    },
    polygon,
    roadsIdentifier: identifier
  })

  const { baseUrl, layerName, style } = wpsResponse
  const layerId = `${polygon.id}-${factor.title}`

  return generateWmsLayer({
    url: baseUrl,
    layer: layerName,
    id: layerId,
    style,
  })
}
