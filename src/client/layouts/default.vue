<template>
  <main class="page-main">
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
import { MapboxMap, SidePanel } from '../components'

export default {
  components: {
    MapboxMap,
    SidePanel
  },
  methods: {
    initializeMap(map) {
      this.$store.dispatch('mapbox/initMap', map)
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
}

.side-panel {
  width: 25%;
}

.map-container {
  width: 75%;
}
</style>
