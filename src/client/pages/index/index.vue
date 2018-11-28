<template>
  <span/>
</template>

<script>
import combineFeatures from '@turf/combine'
import geojsonExtent from '@mapbox/geojson-extent'
import { mapState } from 'vuex'

import getFeature from '../../lib/get-feature'
import geoserverUrl from '../../lib/geoserver-url'
import getFeatureInfo from '../../lib/get-feature-info'
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
  methods: {
    initMapState() {
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
      const bounds = geojsonExtent({
        type: 'FeatureCollection',
        features: event.features
      })
        .map(bound => bound.toFixed(4))

      // Go from lng-lat to lat-lng.
      // This is needed for GeoServer, from version 1.1.0 and above.
      const bbox = [ bounds[1], bounds[0], bounds[3], bounds[2] ].join(',')

      getFeature({ layer: 'road:global_roads', bbox })
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
