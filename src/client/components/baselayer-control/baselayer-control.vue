<template>
  <button
    class="baselayer-control"
    @click="switchBaseLayer"
  >
    base
  </button>
</template>

<script>
export default {
  props: {
    layers: {
      type: Array,
      default: () => []
    },
    switchHandler: {
      type: Function,
      default: () => {}
    },
  },
  data() {
    return {
      currentLayerIndex: 0
    }
  },
  methods: {
    switchBaseLayer() {
      const nextIndex = (this.currentLayerIndex + 1) % this.layers.length
      this.switchHandler(this.layers[nextIndex].style)

      this.currentLayerIndex = nextIndex
    }
  },
}
</script>

<style>
  .baselayer-control {
    width: 30px;
    height: 30px;
    background-color: white;
    outline: 0;
    border-radius: 4px;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}
</style>
