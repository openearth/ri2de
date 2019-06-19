<template>
  <div class="export-button">
    <md-button class="md-raised md-primary">
      Open
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
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      showSnackBar: true
    }
  },
  computed: {
    ...mapState('mapbox/selections', [ 'selections' ]),
    ...mapState('hazards', [ 'selectedHazardIndex' ]),
  },
  methods: {
    ...mapActions({
      showError: 'notifications/showError',
    }),
    onFileInput(event) {
      this.$store.dispatch('importProject', event)
        .then(() => {
          // redirect to the right page after the import is done
          if (this.selectedHazardIndex !== undefined) {
            this.$router.replace('/susceptibilities')
          } else if (this.selections.length) {
            this.$router.replace('/hazards')
          }
        })
        .catch(error => this.showError({ message: 'Could not load file' }))
    }
  }
}
</script>

<style>
.export-button {
  position: relative;
  cursor: pointer;
  display: flex;
}

.export-button .md-button {
  flex: 1;
  z-index: 0;
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
