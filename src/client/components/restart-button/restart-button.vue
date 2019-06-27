<template>
  <md-button
    class="md-raised md-primary"
    v-on="$listeners"
  >
    Restart
  </md-button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: 'Restart'
    }
  }
}
</script>
