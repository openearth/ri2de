export default function({ id, data, paint={}, layout={} }) {
  return {
    id,
    type: 'fill',
    source: {
      type: 'geojson',
      data
    },
    layout,
    paint,
  }
}
