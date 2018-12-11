<template>
  <div class="input-range">
    <span class="md-subheader md-theme-default">
      {{ label }}
    </span>

    <div class="input-range__input">
      <vue-slider
        v-model="val"
        :width="options.width"
        :height="options.height"
        :tooltip-style="options.tooltipStyle"
        :process-style="options.processStyle"
        :bg-style="options.bgStyle"
        :min="min"
        :max="max"
        tooltip="always"
      />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'

export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: Array,
      required: true,
    },
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      val: this.value,
      options: {
        width: '100%',
        height: 8,
        tooltipStyle: {
          "height": "25px",
          "backgroundColor": "#008FC5",
          "borderColor": "#008FC5",
        },
        processStyle: {
          "backgroundColor": "#ccc",
        },
        bgStyle: {
          "backgroundColor": "#ccc",
        },
      },
    }
  },
  watch: {
    val: debounce(function(value) {
      this.$emit('updateClasses', [this.min, value[0], value[1], this.max])
    }, 1000)
  },
}
</script>

<style>
.input-range__input {
  margin-top: 35px;
}

.input-range__range {
  flex-grow: 1;
  margin-right: var(--spacing-default);
}
</style>
