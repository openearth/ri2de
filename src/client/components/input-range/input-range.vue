<template>
  <div class="input-range">
    <span class="md-subheader md-theme-default">
      {{ label }}
    </span>

    <div class="input-range__input">
      <vue-slider
        :value="value"
        :width="options.width"
        :height="options.height"
        :process="showLegendColors ? options.process : false"
        :tooltip-style="options.tooltipStyle"
        :process-style="options.processStyle"
        :min="min"
        :max="max"
        :class="{ 'input-range__slider--show-colors': showLegendColors }"
        tooltip="always"
        @change="onInput"
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
    showLegendColors: {
      type: Boolean,
      default: false
    }
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
        process: dotsPos => [
          [0, dotsPos[0], { backgroundColor: '#2a7221' }],
          [dotsPos[0], dotsPos[1], { backgroundColor: '#ffce4b' }]
        ],
        processStyle: {
          "backgroundColor": "#ccc",
        },
        bgStyle: {
          "backgroundColor": "#ccc",
        },
      },
    }
  },
  methods: {
    onInput: debounce(function(value) {
      this.$emit('updateClasses', [this.min, value[0], value[1], this.max])
    }, 1000)
  }
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

.input-range__slider--show-colors .vue-slider-rail {
  background-color: #df2935;
}
</style>
