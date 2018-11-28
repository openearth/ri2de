<template>
  <portal to="side-panel">
    <div>
      <content-card
        :is-active="false"
        :title="'Infrastructure'"
      >
        <infrastructure-list
          v-if="features.length"
          slot="content"
          :infrastructure="selections"
          @delete="deleteInfrastructure"
          @mouseover="enterInfrastructureItem"
          @mouseout="leaveInfrastructureItem"
        />
        <p
          v-else
          slot="content"
        >
          Select the infrastructure you want to conduct calculations on
        </p>

        <md-button
          slot="actions"
          class="md-raised md-primary"
          @click="saveInfrastructure"
        >
          Save
        </md-button>
      </content-card>
      <content-card
        :is-active="true"
        :title="'Hazard'"
      >
        <hazards-list
          slot="content"
          :hazards="hazardsList"
          @select="onSelect"
        />
        <md-button
          slot="actions"
          class="md-raised md-primary bnt-save"
          @click="saveHazard"
        >
          Save
        </md-button>
      </content-card>
      <susceptibility-list
        :factors="susceptibilityList"
        @setWeightFactor="onSetWeightFactor"
      />
    </div>
  </portal>
</template>

<script>
import combineFeatures from '@turf/combine'
import geojsonExtent from '@mapbox/geojson-extent'
import { mapState } from 'vuex'

import geoserverUrl from '../lib/geoserver-url'
import getFeature from '../lib/get-feature'
import getFeatureInfo from '../lib/get-feature-info'
import { globalRoads } from '../lib/project-layers'
import initMapState from '../lib/mixins/init-map-state'
import layers from '../lib/_mapbox/layers'

import { InfrastructureList, ContentCard, HazardsList, SusceptibilityList } from '../components'

const INFRASTRUCTURE_DEFAULT_COLOR = '#A34751'
const INFRASTRUCTURE_HIGHLIGHT_COLOR = '#FF0000'

export default {
  components: { InfrastructureList, ContentCard, HazardsList, SusceptibilityList },
  mixins: [ initMapState ],
  data() {
    return {
      hazardsList: [{ title: 'Erosion of culvert' }, { title: 'Landslides' }, { title: 'Earthquakes' }, { title: 'Wind' }],
      susceptibilityList: [{ title: 'Landuse', id: 1, weightFactorOptions: { min: 1, max: 50, step: 1 } }, { title: 'Something else', id: 2, weightFactorOptions: { min: 1, max: 20, step: 1 } }],
    }
  },
  computed: {
    ...mapState('mapbox/features', [ 'features' ]),
    ...mapState('mapbox/selections', [ 'selections' ]),
  },
  methods: {
    deleteInfrastructure(index) {
      const selection = this.selections[index]

      this.$store.dispatch('mapbox/selections/delete', selection.id)
      selection.features.forEach(featureId => {
        this.$store.dispatch('mapbox/features/remove', featureId)
      })
    },
    enterInfrastructureItem(index) {
      const infrastructure = this.selections[index]

      this.$store.dispatch('mapbox/features/setStyle', {
        id: infrastructure.features[0],
        styleOption: 'line-color',
        value: INFRASTRUCTURE_HIGHLIGHT_COLOR,
      })
    },
    leaveInfrastructureItem(index) {
      const infrastructure = this.selections[index]

      this.$store.dispatch('mapbox/features/setStyle', {
        id: infrastructure.features[0],
        styleOption: 'line-color',
        value: INFRASTRUCTURE_DEFAULT_COLOR,
      })
    },
    saveInfrastructure() {
      console.log('save')
    },
    saveHazard() {
      console.log('save')
    },
    onSelect(index) {
      console.log('selected', index)
    },
    onSetWeightFactor({ value, index }) {
      console.log('item: ', this.susceptibilityList[index].title, 'weight factor: ', value)
    },
    initMapState() {
      this.$store.dispatch('mapbox/wms/add', globalRoads)
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

      this.features
        .forEach(feature => {
          this.$store.dispatch('mapbox/features/add', layers.geojson.line({
            id: feature.id,
            data: feature.source.data,
            paint: {
              'line-width': 10,
              'line-color': INFRASTRUCTURE_DEFAULT_COLOR,
              'line-opacity': 0.8,
            },
          }))
        })

        this.selections
          .map(selection => selection.polygon[0])
          .forEach(selection => {
            this.$store.dispatch('mapbox/selections/draw', selection)
          })
    },
    mapClickHandler({ point, target, ...rest }) {
      const canvas = target.getCanvas()
      const { _ne, _sw } = target.getBounds()
      const { x, y } = point

      getFeatureInfo({
        layer: 'road:global_roads',
        ne: _ne,
        sw: _sw,
        width: canvas.offsetWidth,
        height: canvas.offsetHeight,
        x,
        y,
      })
        .then(feature => {
          if(!feature) {
            console.log('No Feature')
          } else if(target.getLayer(feature.properties.osm_id)) {
            this.$store.dispatch('mapbox/features/remove', feature.properties.osm_id)
          } else {
            this.$store.dispatch('mapbox/features/add', layers.geojson.line({
              id: feature.properties.osm_id,
              data: feature,
              paint: {
                'line-width': 10,
                'line-color': INFRASTRUCTURE_DEFAULT_COLOR,
                'line-opacity': 0.8,
              },
            }))
          }
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
    }
  }
}
</script>

<style>
.content-card {
  margin-bottom: var(--spacing-default);
}
</style>
