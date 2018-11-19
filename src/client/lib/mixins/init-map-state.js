import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('mapbox', ['mapIsLoaded']),
  },
  watch: {
    mapIsLoaded(loaded) {
      this.__initMapState()
    }
  },
  mounted() {
    this.__initMapState()
  },
  methods: {
    __initMapState() {
      if(!this.initMapState) {
        console.error('initMapState mixin expects a \'initMapState\' method to be available.')
        return
      }

      if(this.mapIsLoaded) {
        this.initMapState()
      }
    }
  }
}
