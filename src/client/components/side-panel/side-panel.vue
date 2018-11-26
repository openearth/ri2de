<template>
  <div class="side-panel">
    <div>
      <h3>Deltares</h3>
      <h2>RI2DE</h2>
    </div>
    <slot />
    <div class="side-panel__bottom">
      <slot name="panel-bottom" />
    </div>
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

  .side-panel__bottom {
    background-color: yellow;
    height: 50px;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
  }
</style>
