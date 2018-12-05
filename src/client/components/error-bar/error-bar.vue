<template>
  <div class="error-bar">
    <div class="error-bar__message">{{ errorMessage }}</div>
  </div>
</template>

<script>
export default {
  props: {
    errorMessage: {
      type: String,
      required: true,
      default: ''
    }
  }
}
</script>

<style>
  .error-bar {
    position: absolute;
    z-index: 3;
    top: 1rem;
    left: 0;
    width: 100%;
    text-align: center;
  }

  .error-bar__message {
    color: #D8000C;
    background-color: #FFD2D2;
    display: inline-block;
    margin-left: auto;
    margin-right: auto;
    padding: .5rem 1rem;
  }
</style>
