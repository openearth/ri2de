<template>
  <button
    class="fitbounds-control"
    @click="fitToBounds"
  >
    fit
  </button>
</template>

<script>
export default {
  props: {
    fitToBounds: {
      type: Function,
      default: () => {}
    }
  }
}
</script>

<style>
  .fitbounds-control {
    width: 30px;
    height: 30px;
    background-color: white;
    outline: 0;
    border-radius: 4px;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }
 </style>
