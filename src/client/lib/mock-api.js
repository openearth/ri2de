const appData = [
  {
    "type": "hazard",
    "name": "erosion of culverts",
    "layers": [
      {
        "title": "slope",
        "wpsFunctionId": "ri2de_calc_slope",
        "classes": [5,10,15],
        "layerName": "Global_Base_Maps:SRTM30_GEBCO",
        "owsUrl": "https://fast.openearth.eu/geoserver/ows?"
      },
      {
        "title": "soil",
        "wpsFunctionId": "ri2de_calc_soil",
        "classes": [],
        "layerName": "",
        "owsUrl": "http://data.isric.org/geoserver/ows?"
      },
      {
        "title": "watercourse",
        "wpsFunctionId": "ri2de_calc_watercourse",
        "classes": [30, 100, 300],
        "layerName": "",
        "owsUrl": ""
      }
    ]
  },
  {
    "type": "hazard",
    "name": "lightning",
    "layers": [
      {
        "title": "slope",
        "wpsFunctionId": "ri2de_calc_slope",
        "classes": [5,10,15],
        "layerName": "Global_Base_Maps:SRTM30_GEBCO",
        "owsUrl": "https://fast.openearth.eu/geoserver/ows?"
      },
      {
        "title": "soil",
        "wpsFunctionId": "ri2de_calc_soil",
        "classes": [],
        "layerName": "",
        "owsUrl": "http://data.isric.org/geoserver/ows?"
      }
    ]
  }
]

const hazards = appData

const susceptibilityFactors = appData
  .reduce((factors, { name, layers }) => ({ ...factors, [ name ]: { id: name, name, layers } }), {})

export function getHazards() {
  return hazards
}

export function getSusceptibilityFactors(id) {
  return susceptibilityFactors[id]
}
