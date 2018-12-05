import geoserverUrl from './geoserver-url'
import layers from './_mapbox/layers'
import wps from './wps'

const globalRoadsUrl = geoserverUrl({
  service: 'WMS',
  request: 'GetMap',
  layers: 'road:global_roads',
  width: 256,
  height: 256,
  srs: 'EPSG:3857',
  transparent: true,
  bbox: '{bbox-epsg-3857}',
  format: 'image/png',
  encode: false
})

export const globalRoads = layers.wms({
  id: 'global_roads',
  tiles: [ globalRoadsUrl ],
  tileSize: 256
})

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

export async function wmsSelectionFromFactor({ factor, polygon }) {
  const wpsResponse = await wps({
    functionId: factor.wpsFunctionId,
    requestData: {
      classes: factor.classes,
      layername: factor.layerName,
      owsurl: factor.owsUrl,
    },
    polygon
  })

  const { baseUrl, layerName, style } = wpsResponse.data
  const layerId = `${polygon.id}-${factor.title}`

  return generateWmsLayer({
    url: baseUrl,
    layer: layerName,
    id: layerId,
    paint: { 'raster-opacity': 1 },
    style,
  })
}
