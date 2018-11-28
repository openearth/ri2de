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
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      value: this.min,
    }
  },
  watch: {
    value(val) {
      this.$emit('onChange', val)
    },
  },
  methods: {
    increaseValue() {
      if (this.value < this.max) {
        this.value = this.value + 1
      }
    },
    decreaseValue() {
      if (this.value > this.min) {
        this.value = this.value - 1
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


