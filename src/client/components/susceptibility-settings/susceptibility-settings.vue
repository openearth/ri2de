<template>
  <div
    class="susceptibility-settings"
  >
    <div class="susceptibility-settings__wrapper">
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
        @updateClasses="onUpdateClasses"
      />

      <layer-legend />
      <add-source-button
        v-if="factor.keywords.length"
        :roadsid="infrastructure[factorIndex].identifier"
        :keywords="factor.keywords"
        :csw="factor.cswUrls"
        @updateFactorLayer="(updatedlayer) => $emit('updateFactorLayer', { updatedlayer, index: factorIndex })"
      />
    </div>
  </div>
</template>

<script>
import WeightFactor from '../weight-factor'
import InputRange from '../input-range'
import LayerLegend from '../layer-legend'
import AddSourceButton from '../add-source-button'


export default {
  components: {
    WeightFactor,
    InputRange,
    LayerLegend,
    AddSourceButton
  },
  props: {
    factor: {
      type: Object,
      required: true
    },
    factorIndex: {
      type: Number,
      required: true
    },
    infrastructure:{
      type:Array,
      required:true,
    }
  },
  methods: {
    onUpdateClasses(classes) {
      // check if the value has change
      if (!classes.every((value, index) => value === this.factor.classes[index])) {
        this.$emit('updateClasses', { classes, index: this.factorIndex })
      }
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
