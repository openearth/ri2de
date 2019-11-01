<template>
  <div class="risk-slider">
    <label
      :for="name"
      class="risk-slider__label md-theme-default"
    >
      {{ label }}
    </label>

    <div class="risk-slider__input">
      <vue-slider
        v-model="val"
        :width="options.width"
        :height="options.height"
        :tooltip-style="options.tooltipStyle"
        :process-style="options.processStyle"
        :bg-style="options.bgStyle"
        :min="min"
        :max="max"
        :id="name"
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
      type: Number,
      required: true,
    },
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
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
      this.$emit(this.name, value)
    }, 1000)
  },
}
</script>

<style>
.risk-slider {
  margin-bottom: 16px;
}

.risk-slider__input {
  margin-top: 35px;
}

.risk-slider__range {
  flex-grow: 1;
  margin-right: var(--spacing-default);
}

.risk-slider__label {
  padding: 0 8px;
  color: var(--md-theme-default-text-accent-on-background, rgba(0, 0, 0, 0.54));
}
</style>
