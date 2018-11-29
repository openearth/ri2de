<template>
  <span/>
</template>

<script>
import { mapState } from 'vuex'

import initMapState from '../../lib/mixins/init-map-state'

export default {
  computed: {
    ...mapState([ 'selectedHazardIndex' ]),
    ...mapState('mapbox/selections', [ 'selections' ]),
  },
  mounted() {
    if(this.selections.length && typeof this.selectedHazardIndex !== 'undefined') {
      this.$store.commit('setActivePage', 'susceptibilities')
    } else if (this.selections.length) {
      this.$router.replace({ path: '/hazards' })
    } else {
      this.$router.replace({ path: '/' })
    }
  },
  methods: {
    initMapState() {
      this.$store.dispatch('mapbox/selections/setMode', 'static')
    }
  }
}
</script>
