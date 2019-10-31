<template>
  <div class="layer-legend">
    <md-subheader>Susceptiblity</md-subheader>
    <div
      v-for="(item, index) in legend"
      :key="item.label"
      class="layer-legend__item"
    >
      <input
        :disabled="index === 0"
        :value="classes[index]"
        :min="classes[index - 1]"
        :max="classes[index + 1]"
        type="number"
        class="layer-legend__input"
        @input="onChange($event, index - 1)"
      >
      <div
        :style="`background-color: ${item.color}`"
        class="layer-legend__square"
      />
      <input 
        :value="classes[index + 1]"
        :disabled="index === legend.length - 1"
        :min="classes[index]"
        :max="classes[index + 2]"
        type="number"
        class="layer-legend__input"
        @input="onChange($event, index)"
      >
      <span class="md-body">{{ item.label }}</span>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'

export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    classes: {
      type: Array,
      required: true
    }
  },
  computed: {
    legend() {
      return [
        { color: '#2A7221', label: 'Low', value: this.classes[1]},
        { color: '#FFCE4B', label: 'Medium', value: this.classes[2]},
        { color: '#DF2935', label: 'High', value: this.classes[3]}
      ]
    }
  },
  methods: {
    onChange: debounce(function(e, index) {
      const value = Number(e.target.value)
      const { min, max } = e.target

      this.legend[index].value = value
      const classes = [this.classes[0], ...this.legend.map(item => item.value)].sort((a, b) => a - b)
      // sort classes from low to high so values in array are not higher then their predecessors
      const sortedClasses = classes.sort((a, b) => a - b)

      this.$emit('updateClasses', sortedClasses)
    }, 1000)
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

.layer-legend__input {
  width: 2rem;
  border: 1px solid black;
}
</style>
