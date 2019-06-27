<template>
  <div class="layer-legend">
    <md-subheader>Susceptiblity</md-subheader>
    <div
      v-for="item in legend"
      :key="item.label"
      class="layer-legend__item"
    >
      <div
        :style="`background-color: ${item.color}`"
        class="layer-legend__square"
      />
      <span class="md-body">{{ item.label }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      legend: [
        { color: '#2A7221', label: 'Low'},
        { color: '#FFCE4B', label: 'Medium'},
        { color: '#DF2935', label: 'High'}
      ]
    }
  }
}
</script>

<style>
.layer-legend__item {
  display: flex;
  align-items: center;
  margin-bottom: .3rem;
}

.layer-legend__square {
  width: 20px;
  height: 20px;
  margin-right: var(--spacing-half);
}
</style>
