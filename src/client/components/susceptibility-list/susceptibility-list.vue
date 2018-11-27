<template>
  <md-list>
    <md-subheader class="susceptibility-list__header">
      Susceptibility factors
      <md-button class="md-dense">Reset</md-button>
    </md-subheader>
    <md-divider />
    <md-list-item class="susceptibility-list__list-item">
      <span class="md-caption">
        <md-icon>remove_red_eye</md-icon>
        Landuse types
      </span>
      <md-icon>keyboard_arrow_right</md-icon>
    </md-list-item>
  </md-list>
</template>

<style>
.susceptibility-list__header {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.md-icon {
  font-size: 20px;
}
</style>

