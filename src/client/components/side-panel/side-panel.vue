<template>
  <div class="side-panel">
    <slot />
  </div>
</template>

<style>
  .side-panel {
    height: 100%;
    width: var(--side-panel-width);
    overflow: auto;
    background-color: #E5EEF2;
    padding: 1rem 1rem 50px 1rem;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  }
</style>
