<template>
  <md-button
    :aria-label="text"
    class="md-icon-button"
    @click="save"
    v-on="$listeners"
  >
    <md-icon aria-hidden="true">save_alt</md-icon>
    <md-tooltip md-direction="bottom">{{ text }}</md-tooltip>
  </md-button>
</template>

<script>
import FileSaver from 'file-saver'

export default {
  props: {
    text: {
      type: String,
      default: 'Save'
    }
  },
  methods: {
    save({ state }) {
      this.$store.dispatch('saveProject')
    },
  }
}
</script>
