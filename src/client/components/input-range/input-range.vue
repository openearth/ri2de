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
        :tooltip-style="options.tooltipStyles"
        :min-range="0"
        :max-range="300"
        tooltip="always"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: [Number, String],
      default: 0,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      val: [20, 50],
      options: {
        width: '100%',
        height: 8,
        tooltipStyles: {
          "height": "25px"
        },
      }
    }
  },
  watch: {
    val(value) {
      this.$emit('change', value)
    }
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
