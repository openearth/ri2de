import axios from 'axios'
import { xmlRequestTemplate } from './template'

export default function({ functionId, requestData, polygon }) {
  const template = xmlRequestTemplate({ functionId, requestData, polygon })
  console.log('TEMPLATE', template)
  return axios({
    method: 'post',
    url: 'https://ri2de.openearth.eu/wps',
    data: template,
    headers: {'Content-Type': 'application/xml'},
  })
}
