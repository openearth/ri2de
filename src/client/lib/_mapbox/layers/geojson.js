export default function geojson({ id, data, type, paint={}, layout={} }) {
  return {
    id,
    type,
    source: {
      tolerance: 3.5,
      type: 'geojson',
      data
    },
    layout,
    paint,
  }
}

export const line = (feature) => geojson({ type: 'line', ...feature })
export const polygon = (feature) => geojson({ type: 'fill', ...feature })
