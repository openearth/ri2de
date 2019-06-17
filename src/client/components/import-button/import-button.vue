<template>
  <div>
    <md-button class="md-raised md-primary">
      <md-icon aria-hidden="true">save_alt</md-icon>
    </md-button>
    <input
      class="page-index__input-file"
      type="file"
      accept="application/json"
      @change="onFileInput"
    >
  </div>
</template>

<script>
export default {
  methods: {
    onFileInput(event) {
      this.$store.dispatch('importProject', event)
        .then(() => console.log('done'))
        .catch(error => console.log(error))
    }
  }
}
</script>
