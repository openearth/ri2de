<template>
  <div>
    <portal to="side-panel-bottom">
      <button
        :disabled="calculatingSusceptibilityLayers || errorCalculatingSusceptibilityLayers"
        class="button button--primary button--full-width"
        @click="calculateTotals"
      >
        Calculate totals
      </button>
    </portal>
    <portal to="map-notification">
      <map-notification
        v-if="calculatingSusceptibilityLayers"
        :message="calculatingMessage"
      />
      <map-notification
        v-else-if="errorCalculatingSusceptibilityLayers"
        :message="errorMessage"
        type="error"
      />
    </portal>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import { generateWmsLayer, wmsSelectionFromFactor, selectionToCustomFactorLayer } from '../../lib/project-layers'
import initMapState from '../../lib/mixins/init-map-state'
import wps from '../../lib/wps'
import getSelectionLayersFactory from '../../lib/get-selection-layers'

import { MapNotification } from '../../components'

export default {
  components: { MapNotification },
  mixins: [ initMapState ],
  data() {
    return {
      errorMessage: undefined,
      errorCalculatingSusceptibilityLayers: false,
      calculatingMessage: 'Calculating susceptibility layers...',
      calculatingSusceptibilityLayers: false,
    }
  },
  computed: {
    ...mapState('hazards', [ 'selectedHazardIndex' ]),
    ...mapState('mapbox/selections', [ 'selections' ]),
    ...mapState('susceptibility-layers', [ 'layersPerSelection' ]),
    ...mapGetters('hazards', [ 'currentSusceptibilityFactors' ]),
    ...mapGetters('mapbox/selections', [ 'selectionsToRoadIds' ]),
  },
  mounted() {
    this.$store.commit('setActivePage', 'susceptibilities')
    this.getSelectionLayers()
  },
  beforeDestroy() {
    if(this.currentSusceptibilityFactors) {
      this.currentSusceptibilityFactors.forEach(factor => {
        if(factor.factorLayers) {
          factor.factorLayers.forEach(layer => this.$store.dispatch('mapbox/wms/remove', layer))
        }
      })
    }
  },
  methods: {
    calculateTotals() {
      this.$router.push({ path: '/results' })
    },
    getSelectionLayers() {
      const getSelectionLayers = getSelectionLayersFactory(this.$store, true)
      this.calculatingSusceptibilityLayers = true
      getSelectionLayers(() => {
        this.calculatingSusceptibilityLayers = false
        this.errorCalculatingSusceptibilityLayers = false
      },
      err => {
        this.errorMessage = 'Error fetching the layers, reload and try again'
        this.errorCalculatingSusceptibilityLayers = true
        console.log(err)
      })
    },
    initMapState() {
      this.$store.dispatch('mapbox/selections/setMode', 'static')
    }
  }
}
</script>
