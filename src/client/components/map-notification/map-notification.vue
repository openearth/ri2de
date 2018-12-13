<template>
  <transition name="fade">
    <div class="map-notification">
      <div
        :class="type ? `map-notification__message--${type}` : ''"
        class="map-notification__message">{{ message }}</div>
    </div>
  </transition>
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
    top: 10px;
    left: 0;
    width: 100%;
    text-align: center;
  }

  .map-notification__message {
    color: #7e671a;
    background-color: #f8edbb;
    display: inline-block;
    margin-left: auto;
    margin-right: auto;
    padding: var(--spacing-default);
    box-shadow: 1px 1px 5px 0 #ccc;
    min-height: 50px;
    border-left: 5px solid #E8BF3A;
  }

  .map-notification__message--error {
    color: #D8000C;
    background-color: #FFD2D2;
    border-left: 5px solid #D8000C;
  }
</style>
