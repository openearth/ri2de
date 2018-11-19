export const NETHERLANDS_CENTER_LATITUDE = 52.155242
export const NETHERLANDS_CENTER_LONGITUDE = 5.387217

export const MAP_CENTER = [
  NETHERLANDS_CENTER_LONGITUDE,
  NETHERLANDS_CENTER_LATITUDE,
]

export const MAP_ZOOM = 7

export const MAP_BASELAYERS = [
  'streets',
  'satellite',
].map(layer => ({
  style: `mapbox://styles/mapbox/${layer}-v9`,
  title: layer,
  thumbnail: `/thumbnails/${layer}.png`
}))

export const MAP_BASELAYER_DEFAULT = MAP_BASELAYERS[0]
