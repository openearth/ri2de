import geoServerUrl from './geoserver-url'

export default function getFeature({ layer='', ...rest }) {
  const url = geoServerUrl({
    service: 'wfs',
    request: 'GetFeature',
    version: '2.0.0',
    outputFormat: 'application/json',
    srsName: 'EPSG:4326',
    typeName: layer,
    ...rest
  })

  return fetch(url)
    .then(response => response.json())
    .catch(err => console.log('Error while getting GeoJson features:', err))
}
