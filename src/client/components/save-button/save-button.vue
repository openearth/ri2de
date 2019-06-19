<template>
  <md-button
    :aria-label="text"
    class="md-raised"
    @click="save"
    v-on="$listeners"
  >
    Save
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
