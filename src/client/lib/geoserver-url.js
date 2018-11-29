import { stringify } from 'query-string'

const WIDTH = 256
const HEIGHT = 256

export default function({
  url,
  service,
  request,
  encode=true,
  width=WIDTH,
  height=HEIGHT,
  ...rest
}) {
  if (!service || !request) {
    return undefined
  }

  const params = stringify({
    service,
    request,
    width,
    height,
    ...rest,
  }, { encode, sort: false })

  return `${url || process.env.GEOSERVER_BASE_URL}?${params}`
}
