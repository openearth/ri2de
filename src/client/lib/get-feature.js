import wps from './wps'

export default function(polygon) {
  return wps({
    functionId: 'ri2de_calc_roads',
    polygon
  })
    .then(({ data }) => JSON.parse(data)[0])
    .then(data => JSON.parse(data.st_asgeojson))
}
