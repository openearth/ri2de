import axios from 'axios'
import { xmlRequestTemplate } from './template'

export default function({ functionId, requestData, polygon, roadsIdentifier, filterData, cswUrls }) {
  const template = xmlRequestTemplate({ functionId, requestData, polygon, roadsIdentifier, filterData, cswUrls })
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

