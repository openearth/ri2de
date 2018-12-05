export const WORLD_CENTER_LATITUDE = 35.204111
export const WORLD_CENTER_LONGITUDE = 17.690741

export const MAP_CENTER = [
  WORLD_CENTER_LONGITUDE,
  WORLD_CENTER_LATITUDE,
]

export const MAP_ZOOM = 2

export const MAP_BASELAYERS = [
  'light',
  'satellite',
].map(layer => ({
  style: `mapbox://styles/mapbox/${layer}-v9`,
  title: layer,
  thumbnail: `/thumbnails/${layer}.png`
}))

export const MAP_BASELAYER_DEFAULT = MAP_BASELAYERS[0]
