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
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      showSnackBar: true
    }
  },
  methods: {
    ...mapActions({
      showError: 'notifications/showError',
    }),
    onFileInput(event) {
      this.$store.dispatch('importProject', event)
        .then(page => this.$router.push(`/${page}`))
        .catch(error => this.showError({ message: 'Could not load file' }))
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
