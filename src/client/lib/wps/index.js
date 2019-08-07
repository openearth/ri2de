import axios from 'axios'
import { xmlRequestTemplate } from './template'

export default function({ functionId, requestData, polygon, roadsIdentifier, filterData, cswUrls, bufferDist, segmentLength }) {
  const template = xmlRequestTemplate({ functionId, requestData, polygon, roadsIdentifier, filterData, cswUrls, bufferDist, segmentLength })  
  return axios({
    method: 'post',
    url: 'https://ri2de.openearth.eu/wps',
    data: template,
    headers: {'Content-Type': 'application/xml'},
  })
    .then(({ data }) => {
      return typeof data === 'object'
        ? data
        : JSON.parse(data)
    })
}

