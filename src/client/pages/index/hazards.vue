<template>
  <span/>
</template>

<script>
import { mapState } from 'vuex'

import initMapState from '../../lib/mixins/init-map-state'

export default {
  mixins: [ initMapState ],
  fetch({ store }) {
    return store.dispatch('hazards/bootstrapHazards')
  },
  computed: {
    ...mapState([ 'activePage' ]),
    ...mapState('mapbox/selections', [ 'selections' ]),
  },
  mounted() {
    this.$store.commit('setActivePage', 'hazards')
  },
  methods: {
    initMapState() {
      this.$store.dispatch('mapbox/selections/setMode', 'static')
    }
  }
}
</script>
