<template>
  <div class="side-panel">
    <slot />
    <div class="side-panel__bottom">
      <slot name="panel-bottom" />
    </div>
  </div>
</template>

<style>
  .side-panel {
    position: relative;
    overflow: auto;
    box-sizing: border-box;
    z-index: 1;
    height: 100%;
    width: var(--side-panel-width);
    background-color: #FDFDFD;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  }

  .side-panel__bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 50px;
    width: 100%;
  }
</style>
