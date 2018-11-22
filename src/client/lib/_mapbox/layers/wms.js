export default function({ id, tiles=[], tileSize=512, paint={} }) {
  return {
    id,
    type: 'raster',
    source: {
      type: 'raster',
      tiles,
      tileSize,
    },
    paint
  }
}
