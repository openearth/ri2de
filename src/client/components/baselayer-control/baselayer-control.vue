<template>
  <button
    class="baselayer-control"
    @click="switchBaseLayer"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        d="M0 0h24v24H0z"
        fill="none"
      />
      <path
        d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"
      />
    </svg>
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
    padding: 3px;
    background-color: white;
    outline: 0;
    border: 0;
    border-radius: var(--border-radius);
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}
</style>
