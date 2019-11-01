<template>
  <div class="layer-legend">
    <md-subheader>Susceptiblity</md-subheader>
    <div
      v-for="(item, index) in legend"
      :key="item.label"
      class="layer-legend__item"
    >
      <input
        v-if="classes && (classes.length === 4)"
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
        v-if="classes && (classes.length === 4)"
        :value="classes[index + 1]"
        :disabled="index === legend.length - 1"
        :min="classes[index]"
        :max="classes[index + 2]"
        type="number"
        class="layer-legend__input"
        @input="onChange($event, index)"
      >
      <span class="layer-legend__label md-body">{{ item.label }}</span>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import { INPUT_UPDATE_INTERVAL } from '../../lib/constants'

export default {
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

      if (value >= min, value <= max) {
        this.legend[index].value = value
        const classes = [this.classes[0], ...this.legend.map(item => item.value)].sort((a, b) => a - b)
        // sort classes from low to high so values in array are not higher then their predecessors
        const sortedClasses = classes.sort((a, b) => a - b)
        this.$emit('updateClasses', sortedClasses)
      } else {
        // when number is too high/low reset the component so the right props get rendered
        this.$forceUpdate()
      }
    }, INPUT_UPDATE_INTERVAL)
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
  width: 40px;
  height: 28px;
  margin: 0 var(--spacing-half);
}

.layer-legend__label {
  margin-left: var(--spacing-half);
}

.layer-legend__input[type="number"] {
  border: 1px solid #ededed;
  width: 3.5rem;
  font-size: 1rem;
  padding: 0.25rem;
}
</style>
