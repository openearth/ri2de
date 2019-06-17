<template>
  <div class="export-button">
    <md-button class="md-icon-button">
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

<style>
.export-button {
  position: relative;
  cursor: pointer;
}

.page-index__input-file {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  opacity: 0;
  cursor: pointer;
}
</style>
