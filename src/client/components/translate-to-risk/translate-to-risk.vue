<template>
  <div class="translate-to-risk">
    <form @submit.prevent>
      <risk-slider
        :value="bufferdist"
        :min="50"
        :max="250"
        label="Buffer"
        name="updateBufferDist"
        @updateBufferDist="(buffer) => $emit('updateBufferDist', buffer)"
      />
      <risk-slider
        :value="segmentlength"
        :min="500"
        :max="2000"
        label="Segment length"
        name="updateSegmentLength"
        @updateSegmentLength="(length) => $emit('updateSegmentLength', length)"
      />

      <button
        :disabled="!totalsLayers.length"
        class="button button--primary button--full-width"
        @click="wpsTranslateToRisk"
      >
        Translate to Risk
      </button>
    </form>
  </div>
</template>
  
<script>
import { mapState } from 'vuex'
import RiskSlider from '../risk-slider'
import wps from '../../lib/wps'
import layers from '../../lib/_mapbox/layers'

export default {
  components: {
    RiskSlider,
  },
  props:{
    bufferdist:{
      type:Number,
      required: true
    },
    segmentlength:{
      type:Number,
      required: true
    },
    
    vulnerabilitylayer:{
      type: Array,
      required: true
    },
    selections:{
      type:Array,
      required: true
    }
  },
  computed: {
    ...mapState('susceptibility-layers', ['totalsLayers']),
  },
  methods:{                 
    async wpsTranslateToRisk() {
      this.$router.push({ path: '/classifyrisk'})           
    }
  } 
}
</script>

<style>
  .translate-to-risk {
    padding-top: 16px;
  }
</style>
