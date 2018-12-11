import wps from './wps'

export default function(polygon) {
  return wps({
    functionId: 'ri2de_calc_roads',
    polygon
  })
    .then(({ data }) => {
      return typeof data === 'object'
        ? data
        : JSON.parse(data)
    })
    .then(data => {
      return data.errMsg
        ? { error: data.errMsg, featureCollection: undefined, roadsIdentifier: undefined }
        : { error: undefined, featureCollection: data.roadsCollection, roadsIdentifier: data.roadsIdentifier }
    })
}
