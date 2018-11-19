<template>
  <div class="side-panel">
    <div>
      <h3>Deltares</h3>
      <h2>RI2DE</h2>
    </div>
    <slot />
  </div>
</template>

<style>
  .side-panel {
    width: 25%;
    height: 100%;
    overflow: auto;
    background-color: #E5EEF2;
    padding: 1rem;
    box-sizing: border-box;
  }
</style>
