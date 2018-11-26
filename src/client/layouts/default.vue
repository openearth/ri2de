<template>
  <main class="page-main">
    <app-header @restart="restartApp" />
    <side-panel>
      <portal-target
        name="side-panel"
        slim
      />
    </side-panel>
    <div class="map-container">
      <mapbox-map @mapCreated="initializeMap" />
    </div>
    <nuxt/>
  </main>
</template>

<script>
import { mapState } from 'vuex'

import { AppHeader, MapboxMap, SidePanel } from '../components'

export default {
  components: {
    AppHeader,
    MapboxMap,
    SidePanel
  },
  methods: {
    initializeMap(map) {
      this.$store.dispatch('mapbox/initMap', map)
      map.on('load', () => {
        this.$store.dispatch('mapbox/addEventHandler', {
          event: 'fitbounds',
          handler: (event) => this.$store.dispatch('mapbox/features/fitToFeatures')
        })
      })
    },
    restartApp() {
      this.$store.dispatch('mapbox/features/resetFeatures')
      this.$store.dispatch('mapbox/addOnceEventHandler', {
        event: 'resize',
        handler: () => this.$store.dispatch('mapbox/moveMapToCenter')
      })
    }
  }
}
</script>

<style>
@import '../components/app-core/index.css';

.page-main {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-wrap: wrap;
}

.side-panel {
  height: calc(100% - 64px);
}

.map-container {
  flex-grow: 3;
  height: calc(100% - 64px);
}
</style>
