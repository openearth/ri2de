import { stringify } from 'query-string'

const BBOX = '{bbox-epsg-3857}'
const FORMAT = 'image/png'
const VERSION = '1.1.1'
const WIDTH = 256
const HEIGHT = 256
const SRS = 'EPSG:3857'
const TRANSPARENT = true

export default function({
  url,
  service,
  request,
  encode=true,
  version=VERSION,
  format=FORMAT,
  width=WIDTH,
  height=HEIGHT,
  transparent=TRANSPARENT,
  srs=SRS,
  bbox=BBOX,
  ...rest
}) {
  if (!service || !request) {
    return undefined
  }

  const params = stringify({
    service,
    request,
    version,
    format,
    width,
    height,
    transparent,
    srs,
    bbox,
    ...rest,
  }, { encode, sort: false })

  return `${url || process.env.GEOSERVER_BASE_URL}?${params}`
}
