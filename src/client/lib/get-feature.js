import geoServerUrl from './geoserver-url'

const OUTPUT_FORMAT = 'application/json'
const SERVICE = 'wfs'
const VERSION = '2.0.0'
const REQUEST = 'GetFeature'
const SRS = 'EPSG:4326'

export default function getFeature({ layer='', ...rest }) {
  const url = geoServerUrl({
    request: REQUEST,
    service: SERVICE,
    version: VERSION,
    outputFormat: OUTPUT_FORMAT,
    srsName: SRS,
    typeName: layer,
    ...rest
  })

  return fetch(url)
    .then(response => response.json())
    .catch(err => console.log('Error while getting GeoJson features:', err))
}
