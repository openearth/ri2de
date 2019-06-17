export const WORLD_CENTER_LATITUDE = 35.204111
export const WORLD_CENTER_LONGITUDE = 17.690741

export const MAP_CENTER = [
  WORLD_CENTER_LONGITUDE,
  WORLD_CENTER_LATITUDE,
]

export const MAP_BASELAYERS = [
  {
    style: 'mapbox://styles/pulautekong/cjwud8m561cby1cp6z82kbkco',
    title: 'light',
    thumbnail: `/thumbnails/light.png`
  },
  {
    style: 'mapbox://styles/mapbox/satellite-v9',
    title: 'sattelite',
    thumbnail: `/thumbnails/sattelite.png`
  },
]

export const MAP_BASELAYER_DEFAULT = MAP_BASELAYERS[0]

export const MAP_ZOOM = 2
