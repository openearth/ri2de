import { stringify } from 'query-string'

export default function({
  url,
  service,
  request,
  encode=true,
  width=256,
  height=256,
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
