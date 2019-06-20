<template>
  <div class="side-panel">
    <slot />
  </div>
</template>

<style>
  .side-panel {
    position: relative;
    box-sizing: border-box;
    z-index: 1;
    height: calc(100% - 64px);
    width: var(--side-panel-width);
    background-color: #FFF;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    display: flex;
    flex-direction: column;
  }
</style>
