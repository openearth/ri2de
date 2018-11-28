const appData = [
  {
    type: 'hazard',
    name: 'erosion of culverts',
    layers: [
      { title: 'landuse', wmsUrl: 'https://ri2de.openearth.eu/geoserver/limburg/wms?service=WMS&version=1.1.0&request=GetMap&layers=limburg:zluse_reclass_filled&styles=&bbox={bbox-epsg-3857}&width=768&height=621&srs=EPSG:28992&format=image/png', legendUrl: 'https://ri2de.openearth.eu/geoserver/limburg/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=limburg:zluse_reclass_filled' },
      { title: 'watercourse', wmsUrl: 'https://ri2de.openearth.eu/geoserver/limburg/wms?service=WMS&version=1.1.0&request=GetMap&layers=limburg:zwaterlopen&styles=&bbox={bbox-epsg-3857}&width=768&height=621&srs=EPSG:28992&format=image/png', legendUrl:'https://ri2de.openearth.eu/geoserver/limburg/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=limburg:zwaterlopen' },
      { title: 'slope', wmsUrl: 'https://ri2de.openearth.eu/geoserver/limburg/wms?service=WMS&version=1.1.0&request=GetMap&layers=limburg:ahn_f25_roadbuf_slope_reclass&styles=&bbox={bbox-epsg-3857}&width=768&height=621&srs=EPSG:4326&format=image/png', legendUrl:'https://ri2de.openearth.eu/geoserver/limburg/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=limburg:ahn_f25_roadbuf_slope_reclass' },
      { title: 'soil', wmsUrl: 'https://ri2de.openearth.eu/geoserver/limburg/wms?service=WMS&version=1.1.0&request=GetMap&layers=limburg:zgrondsoorten_buffered&styles=&bbox={bbox-epsg-3857}&width=768&height=414&srs=EPSG:28992&format=image/png', legendUrl:'https://ri2de.openearth.eu/geoserver/limburg/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=limburg:zgrondsoorten_buffered' },
      { title: 'culvert', wmsUrl: 'https://ri2de.openearth.eu/geoserver/limburg/wms?service=WMS&version=1.1.0&request=GetMap&layers=limburg:zduikers&styles=&bbox={bbox-epsg-3857}&width=768&height=621&srs=EPSG:28992&format=image/png', legendUrl: 'https://ri2de.openearth.eu/geoserver/limburg/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=limburg:zduikers' },
    ]
  },
  {
    type: 'hazard',
    name: 'lightning',
    layers: [
      { title: 'landuse', wmsUrl: 'https://ri2de.openearth.eu/geoserver/limburg/wms?service=WMS&version=1.1.0&request=GetMap&layers=limburg:zluse_reclass_filled&styles=&bbox={bbox-epsg-3857}&width=768&height=621&srs=EPSG:28992&format=image/png', legendUrl: 'https://ri2de.openearth.eu/geoserver/limburg/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=limburg:zluse_reclass_filled' },
      { title: 'watercourse', wmsUrl: 'https://ri2de.openearth.eu/geoserver/limburg/wms?service=WMS&version=1.1.0&request=GetMap&layers=limburg:zwaterlopen&styles=&bbox={bbox-epsg-3857}&width=768&height=621&srs=EPSG:28992&format=image/png', legendUrl:'https://ri2de.openearth.eu/geoserver/limburg/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=limburg:zwaterlopen' },
      { title: 'slope', wmsUrl: 'https://ri2de.openearth.eu/geoserver/limburg/wms?service=WMS&version=1.1.0&request=GetMap&layers=limburg:ahn_f25_roadbuf_slope_reclass&styles=&bbox={bbox-epsg-3857}&width=768&height=621&srs=EPSG:4326&format=image/png', legendUrl:'https://ri2de.openearth.eu/geoserver/limburg/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=limburg:ahn_f25_roadbuf_slope_reclass' },
      { title: 'soil', wmsUrl: 'https://ri2de.openearth.eu/geoserver/limburg/wms?service=WMS&version=1.1.0&request=GetMap&layers=limburg:zgrondsoorten_buffered&styles=&bbox={bbox-epsg-3857}&width=768&height=414&srs=EPSG:28992&format=image/png', legendUrl:'https://ri2de.openearth.eu/geoserver/limburg/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=limburg:zgrondsoorten_buffered' },
      { title: 'culvert', wmsUrl: 'https://ri2de.openearth.eu/geoserver/limburg/wms?service=WMS&version=1.1.0&request=GetMap&layers=limburg:zduikers&styles=&bbox={bbox-epsg-3857}&width=768&height=621&srs=EPSG:28992&format=image/png', legendUrl: 'https://ri2de.openearth.eu/geoserver/limburg/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=limburg:zduikers' },
    ]
  }
]

const hazards = appData
  .map((item, index) => ({ name: item.name, id: index, title: item.name }))
const susceptibilityFactors = appData
  .reduce((factors, { name, layers }) => ({ ...factors, [ name ]: { id: name, name, layers } }), {})

export function getHazards() {
  return hazards
}

export function getSusceptibilityFactors(id) {
  return susceptibilityFactors[id]
}
