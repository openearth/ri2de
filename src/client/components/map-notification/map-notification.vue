<template>
  <div class="map-notification">
    <div
      :class="type ? `map-notification__message--${type}` : ''"
      class="map-notification__message">{{ message }}</div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
      default: '',
    },
    type: {
      type: String,
      required: false,
      default: undefined,
    }
  }
}
</script>

<style>
  .map-notification {
    position: absolute;
    z-index: 3;
    top: var(--spacing-default);
    left: 0;
    width: 100%;
    text-align: center;
  }

  .map-notification__message {
    color: var(--md-theme-default-primary);
    background-color: #E5EEF2;
    display: inline-block;
    margin-left: auto;
    margin-right: auto;
    padding: var(--spacing-half) var(--spacing-default);
  }

  .map-notification__message--error {
    color: #D8000C;
    background-color: #FFD2D2;
    display: inline-block;
    margin-left: auto;
    margin-right: auto;
    padding: var(--spacing-half) var(--spacing-default);
  }
</style>
