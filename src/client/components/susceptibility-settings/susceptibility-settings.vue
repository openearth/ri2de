<template>
  <div
    class="susceptibility-settings"
  >
    <div class="susceptibility-settings__wrapper">
      <md-button
        class="md-icon-button md-dense susceptibility-settings__button"
        @click="$emit('close')"
      >
        <md-icon>clear</md-icon>
      </md-button>
      <weight-factor
        :min="factor.min"
        :max="factor.max"
        :step="factor.step"
        :weight-factor="factor.weightFactor"
        @onChange="(value) => $emit('weightFactorChange', { value, index: factorIndex })"
      />
      <input-range
        v-if="factor.classes && (factor.classes.length === 4)"
        :key="factor.title"
        :value="[factor.classes[1], factor.classes[2]]"
        :min="factor.classes[0]"
        :max="factor.classes[3]"
        label="Classes"
        @updateClasses="classes => $emit('updateClasses', { classes, index: factorIndex })"
      />
      <layer-legend />
    </div>
  </div>
</template>

<script>
import WeightFactor from '../weight-factor'
import InputRange from '../input-range'
import LayerLegend from '../layer-legend'

export default {
  components: {
    WeightFactor,
    InputRange,
    LayerLegend
  },
  props: {
    factor: {
      type: Object,
      required: true
    },
    factorIndex: {
      type: Number,
      required: true
    }
  }
}
</script>

<style>
.susceptibility-settings {
  --card-width: 270px;
  width: var(--card-width);
  position: absolute;
  top: 9rem;
  left: 1.5rem;
  padding: var(--spacing-default);
  background-color: #fff;
  z-index: 2;
  box-shadow: 0 2px 5px 0 var(--neutral-color);
}

.susceptibility-settings .md-subheader {
  padding: 0;
}

.susceptibility-settings__wrapper {
  position: relative;
}

.susceptibility-settings__button {
  position: absolute !important;
  top: calc(calc(var(--spacing-default) - 10px) * -1);
  right: calc(calc(var(--spacing-default) - 10px) * -1);
  margin: 0 !important;
}
</style>
