<template>
  <portal to="map-notification">
    <map-notification
      v-if="fetchingRoads"
      :message="fetchingRoadsMessage"
    />
    <map-notification
      v-else-if="errorMessage"
      :message="errorMessage"
      type="error"
    />
  </portal>
</template>

<script>
import { mapState } from 'vuex'

import getFeature from '../../lib/get-feature'
import initMapState from '../../lib/mixins/init-map-state'
import layers from '../../lib/_mapbox/layers'

import { MapNotification } from '../../components'

const INFRASTRUCTURE_DEFAULT_COLOR = '#502D56'

export default {
  components: { MapNotification },
  mixins: [ initMapState ],
  data() {
    return {
      errorMessage: undefined,
      fetchingRoads: false,
      fetchingRoadsMessage: 'Fetching infrastructure in the selected area...'
    }
  },
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
    this.$store.dispatch('mapbox/selections/hideAll')
  },
  methods: {
    initMapState() {
      this.selections
        .map(selection => selection.polygon)
        .forEach(selection => {
          this.$store.dispatch('mapbox/selections/draw', selection)
        })
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
      this.fetchingRoads = true
      const selectionId = event.features[0].id

      getFeature(event.features[0])
        .then(({ featureCollection, roadsIdentifier, error }) => {
          if(error) {
            this.fetchingRoads = false
            this.errorMessage = error
            this.$store.dispatch('mapbox/selections/delete', selectionId)
            setTimeout(() => { this.errorMessage = undefined }, 4000)
            return
          }
          
          this.$store.dispatch('mapbox/features/add', layers.geojson.line({
            id: selectionId,
            data: featureCollection,
            paint: {
              'line-width': 5,
              'line-color': INFRASTRUCTURE_DEFAULT_COLOR,
              'line-opacity': 0.8,
            },
          }))

          // Find the last used number for an unnamed selection number by matching for 'Selection [number]'
          const latestUnnamedSelectionNumber = this.selections
            .filter(selection => selection.title.match(/^Selection 0*[1-9][0-9]*$/))
            .map(selection => selection.title.replace( /^\D+/g, ''))
            .map(string => Number(string))
            .sort((a, b) => b - a)[0]

          this.$store.commit('mapbox/selections/add', {
            title: `Selection ${latestUnnamedSelectionNumber ? latestUnnamedSelectionNumber + 1 : 1}`,
            id: selectionId,
            features: [ selectionId ],
            polygon: event.features[0],
            identifier: roadsIdentifier,
          })

          this.fetchingRoads = false
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
