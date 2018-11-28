<template>
  <div class="layer-legend">
    <md-subheader>Legend</md-subheader>
    <img
      :src="legendUrl"
      alt="layer legend"
    >
  </div>
</template>

<script>
export default {
  props: {
    legendUrl: {
      type: String,
      required: true,
    }
  }
}
</script>
