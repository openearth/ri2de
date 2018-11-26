<template>
  <md-button
    :aria-label="text"
    class="md-icon-button"
    v-on="$listeners"
  >
    <md-icon aria-hidden="true">restore_page</md-icon>
    <md-tooltip md-direction="bottom">{{ text }}</md-tooltip>
  </md-button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: 'begin opnieuw'
    }
  }
}
</script>
