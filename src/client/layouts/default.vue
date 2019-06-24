<template>
  <main class="page-main">
    <app-header @restart="restartApp" />
    <side-panel>
      <div class="side-panel__container">
        <portal-target
          class="side-panel__body"
          name="side-panel"
          slim
        />
        <div class="side-panel__bottom">
          <portal-target
            name="side-panel-bottom"
            slim
          />
        </div>
      </div>
    </side-panel>
    <div class="map-container">
      <portal-target name="susceptibility-settings"/>
      <portal-target
        name="map-notification"
        slim
      />
      <mapbox-map @mapCreated="initializeMap" />
    </div>
    <nuxt/>
    <notification-area
      :notifications="notifications"
      @remove-notification="removeNotification"
    />
  </main>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { AppHeader, MapboxMap, SidePanel, NotificationArea } from '../components'

export default {
  components: {
    AppHeader,
    MapboxMap,
    SidePanel,
    NotificationArea
  },
  computed: {
    ...mapState({
      notifications: state => state.notifications.messages
    })
  },
  beforeMount() {
    this.$router.replace('/')
  },
  methods: {
    ...mapMutations({
      removeNotification: 'notifications/remove',
    }),
    initializeMap(map) {
      this.$store.dispatch('mapbox/initMap', map)
      map.on('load', () => {
        this.$store.dispatch('mapbox/addEventHandler', {
          event: 'fitbounds',
          handler: (event) => this.$store.dispatch('mapbox/selections/fitToFeatures')
        })

        this.$store.dispatch('mapbox/selections/fitToFeatures')
      })
    },
    restartApp() {
      this.$store.dispatch('restartApp')
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
  padding: var(--spacing-half) var(--spacing-default);
}

.side-panel__container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.side-panel__body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.map-container {
  flex-grow: 3;
  height: calc(100% - 64px);
  position: relative;
}
</style>
