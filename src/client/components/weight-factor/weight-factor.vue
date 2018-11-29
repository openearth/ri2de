<template>
  <div>
    <md-subheader>Weight Factor</md-subheader>
    <md-button
      class="md-icon-button input-control"
      @click="decreaseValue"
    >
      <md-icon>remove</md-icon>
    </md-button>
    <input
      v-model="value"
      :min="min"
      :max="max"
      :step="step"
      type="number"
      class="input"
    >
    <md-button
      class="md-icon-button input-control"
      @click="increaseValue"
    >
      <md-icon>add</md-icon>
    </md-button>
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
  },
  data() {
    return {
      value: this.max,
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
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input {
  height: 40px;
  width: 40px;
  font-size: 14px;
  text-align: center;
}
</style>
