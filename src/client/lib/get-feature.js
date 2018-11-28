import geoServerUrl from './geoserver-url'

const OUTPUT_FORMAT = 'application/json'
const SERVICE = 'wfs'
const VERSION = '2.0.0'
const REQUEST = 'GetFeature'
const SRS = 'EPSG:4326'

export default function getFeature({ layer, bbox }) {
  const url = geoServerUrl({
    encode: false,
    service: SERVICE,
    version: VERSION,
    request: REQUEST,
    outputFormat: OUTPUT_FORMAT,
    srsName: SRS,
    typeName: layer,
    bbox,
  })

  return fetch(url)
    .then(response => response.json())
    // .then(featureResponse => featureResponse.features)
    .catch(err => console.log('ERR', err))
}
