<template>
  <div class="weight-factor">
    <input
      v-model="value"
      :min="min"
      :max="max"
      :step="step"
      type="number"
      class="input"
    >
  </div>
</template>

<script>
export default {
  props: {
    min: {
      type: Number,
      required: false,
      default: 0,
    },
    max: {
      type: Number,
      required: false,
      default: 1,
    },
    step: {
      type: Number,
      required: false,
      default: 0.1,
    },
    weightFactor: {
      type: Number,
      required: false,
      default: null,
    }
  },
  data() {
    return {
      value: this.weightFactor || this.max,
    }
  },
  watch: {
    value(val) {
      this.$emit('onChange', val)
    },
  },
  methods: {
    increaseValue() {
      const newValue = Number(Number(this.value) + Number(this.step)).toFixed(1)

      if (newValue <= this.max) {
        this.value = newValue
      }
    },
    decreaseValue() {
      const newValue = Number(Number(this.value) - Number(this.step)).toFixed(1)

      if (newValue >= this.min) {
        this.value = newValue
      }
    }
  }
}
</script>

<style>
.weight-factor {
  display: flex;
  align-items: center;
  padding: 0 1rem;
}

input[type=number] {
  -moz-appearance: textfield;
  border: none;
  border-radius: 4px;
}

.input {
  height: 30px;
  width: 40px;
  font-size: var(--font-size-default);
  text-align: center;
}
</style>
