<template>  
  <input-range
    :value="[riskclasses[1], riskclasses[2]]"
    :min="0"
    :max="3"
    :interval="0.1"
    show-legend-colors
    label="Classes"
    @updateClasses="(classes) =>$emit('updateRiskClasses', classes)"
  />
</template>

<script>

import InputRange from '../input-range'
export default {
    components:{
        InputRange,
    },
    props:{
      riskclasses:{
        type:Array,
        required: true
      }
    }
}
</script>
  