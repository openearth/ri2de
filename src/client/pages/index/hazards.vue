<template>
  <span/>
</template>

<script>
import { mapState } from 'vuex'

import initMapState from '../../lib/mixins/init-map-state'

export default {
  mixins: [ initMapState ],
  computed: {
    ...mapState([ 'activePage' ]),
    ...mapState('mapbox/selections', [ 'selections' ]),
  },
  mounted() {
    if(this.selections.length) {
      this.$store.commit('setActivePage', 'hazards')
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
