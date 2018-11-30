<template>
  <span/>
</template>

<script>
import combineFeatures from '@turf/combine'
import { mapState } from 'vuex'

import getFeature from '../../lib/get-feature'
import initMapState from '../../lib/mixins/init-map-state'
import layers from '../../lib/_mapbox/layers'

const INFRASTRUCTURE_DEFAULT_COLOR = '#A34751'

export default {
  mixins: [ initMapState ],
  computed: {
    ...mapState('mapbox/selections', [ 'selections' ]),
  },
  mounted() {
    this.$store.commit('setActivePage', 'index')
  },
  beforeDestroy() {
    this.$store.dispatch('mapbox/removeEventHandler', { event: 'draw.create' })
    this.$store.dispatch('mapbox/removeEventHandler', { event: 'draw.delete' })
    this.$store.dispatch('mapbox/removeEventHandler', { event: 'draw.update' })
    this.$store.dispatch('mapbox/selections/setMode', 'static')
  },
  methods: {
    initMapState() {
      this.$store.dispatch('mapbox/selections/setMode', 'simple_select')
      this.$store.dispatch('mapbox/addEventHandler', {
        event: 'draw.create',
        handler: (event) => this.createSelection(event)
      })
      this.$store.dispatch('mapbox/addEventHandler', {
        event: 'draw.delete',
        handler: (event) => this.deleteSelection(event)
      })
      this.$store.dispatch('mapbox/addEventHandler', {
        event: 'draw.update',
        handler: (event) => this.updateSelection(event)
      })
    },
    createSelection(event) {
      const selectionId = event.features[0].id
      const coordinates = event
        .features[0]
        .geometry
        .coordinates[0]
        .map(coordinate => [ ...coordinate ].reverse().join(' '))
        .join(', ')

      getFeature({
        layer: 'road:global_roads',
        cql_filter: `INTERSECTS(wkb_geometry, POLYGON((${coordinates})))`
      })
        .then(featureCollection => {
          this.$store.dispatch('mapbox/features/add', layers.geojson.line({
            id: selectionId,
            data: combineFeatures(featureCollection),
            paint: {
              'line-width': 10,
              'line-color': INFRASTRUCTURE_DEFAULT_COLOR,
              'line-opacity': 0.8,
            },
          }))

          this.$store.commit('mapbox/selections/add', {
            title: 'Unnamed Selection',
            id: selectionId,
            features: [ selectionId ],
            polygon: event.features
          })
        })
    },
    deleteSelection(event) {
      const selectionId = event.features[0].id
      const selection = this.selections.find(selection => selection.id === selectionId)

      if(selection) {
        this.$store.commit('mapbox/selections/remove', selectionId)
        selection.features.forEach(featureId => {
          this.$store.dispatch('mapbox/features/remove', featureId)
        })
      }
    },
    updateSelection(event) {
      this.deleteSelection(event)
      this.createSelection(event)
    },
  }
}
</script>
