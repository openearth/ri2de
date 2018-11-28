<template>
  <span/>
</template>

<script>
import { mapState } from 'vuex'

export default {
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
}
</script>
