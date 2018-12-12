<template>
  <main class="page-main">
    <app-header @restart="restartApp" />
    <side-panel>
      <portal-target
        name="side-panel"
        slim
      />
      <div class="side-panel__bottom">
        <portal-target
          name="side-panel-bottom"
          slim
        />
      </div>
    </side-panel>
    <div class="map-container">
      <portal-target
        name="map-notification"
        slim
      />
      <mapbox-map @mapCreated="initializeMap" />
    </div>
    <nuxt/>
  </main>
</template>

<script>
import { mapState } from 'vuex'

import { globalRoads } from '../lib/project-layers'

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
          handler: (event) => this.$store.dispatch('mapbox/selections/fitToFeatures')
        })
      })
    },
    restartApp() {
      this.$store.dispatch('mapbox/wms/resetLayers')
      this.$store.dispatch('mapbox/wms/add', globalRoads)
      this.$store.dispatch('mapbox/features/resetFeatures')
      this.$store.dispatch('mapbox/selections/reset')
      this.$store.dispatch('mapbox/moveMapToCenter')
      this.$store.dispatch('susceptibility-layers/reset')
      this.$router.replace({ path: '/' })
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

.side-panel__bottom {
  display: flex;
  height: 50px;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
}

.map-container {
  flex-grow: 3;
  height: calc(100% - 64px);
  position: relative;
}
</style>
