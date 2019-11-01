<template>
  <portal to="map-notification">
    <map-notification
      v-if="calculating"
      :message="calculatingMessage"
    />
    <map-notification
      v-else-if="errorFetchingRiskFeatures"
      :message="errorMessage"
      type="error"
    />
  </portal>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { MapNotification } from '../../components'
import wps from '../../lib/wps'
import layers from '../../lib/_mapbox/layers'

export default {
  components: { MapNotification },
  data() {
    return {
      calculating: true,
      calculatingMessage: 'Calculating the risk map ....',
      errorMessage: undefined,
      errorFetchingRiskFeatures: false,
    }
  },
  computed:{
    ...mapState('susceptibility-layers', [ 'LayersForRisk' ]),
    ...mapState('mapbox/selections', [ 'selections' ]),
    ...mapState('hazards', [ 'bufferDist', 'segmentLength']),

  },
  mounted() {
    this.$store.commit('setActivePage','classifyrisk')
    this.TrasnslateToRisk()
  },
  beforeDestroy() {
    this.$store.dispatch('mapbox/features/resetRiskFeatures')
    this.$store.dispatch('susceptibility-layers/resetLayersForRisk')
    
    
  },
  methods: {
    async TrasnslateToRisk(){
      try{
        const RiskFeatures = await Promise.all(this.LayersForRisk.map(async layer => {
          const RiskResponse = await wps ({
            functionId: "ri2de_calc_risk",
            segmentLength: this.segmentLength,
            bufferDist: this.bufferDist,
            requestData:{
              classes: [],
              layername: layer.layer,
              owsurl: layer.url,
            },
            roadsIdentifier: layer.roadsId


          })
          const riskFeatures = layers.geojson.line({
            id: layer.roadsId,
            data: RiskResponse,
            paint:{
              'line-width':5,
              'line-color':['get','color'],
              'line-opacity':0.8,
            }

          })
          
          this.$store.dispatch('mapbox/features/addRiskFeatures', riskFeatures)
        } 
        ))      
      } catch(e){
        this.errorMessage = 'Error fetching the risk features, reload and try again'
        this.errorFetchingRiskFeatures = true
        console.error(`Error: ${e}`)
      }
      this.calculating = false
    
    }
  
  }
}
 
  
</script>