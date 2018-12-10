<template>
  <md-list class="susceptibility-list">
    <md-subheader class="susceptibility-list__header">
      Susceptibility factors
      <md-button class="md-dense">Reset</md-button>
    </md-subheader>
    <md-divider />
    <div
      v-for="(factor, index) in factors"
      :key="factor.id"
    >
      <md-list-item>
        <md-button
          class="md-icon-button"
          @click="toggleFactorActivity(index)"
        >
          <md-icon :disabled="!factor.visible">
            {{ factor.visible ? 'visibility' : 'visibility_off' }}
          </md-icon>
        </md-button>
        <span class="susceptibility-list__item-title">{{ factor.title }}</span>
        <md-button
          :class="{ 'md-raised md-primary' : selectedFactorIndex === index }"
          class="md-icon-button"
          @click="() => toggleSettings(index)"
        >
          <md-icon>keyboard_arrow_right</md-icon>
        </md-button>
      </md-list-item>
      <transition name="fade">
        <div
          v-if="selectedFactorIndex === index"
          class="list-item__settings"
        >
          <weight-factor
            :min="factor.min"
            :max="factor.max"
            :step="factor.step"
            :weight-factor="factor.weightFactor"
            @onChange="(value) => $emit('setWeightFactor', { value, index })"
          />
          <input-range
            v-if="factor.classes && (factor.classes.length === 4)"
            :label="'Classes'"
            :value="[factor.classes[1], factor.classes[2]]"
            :min="factor.classes[0]"
            :max="factor.classes[3]"
            @updateClasses="classes => $emit('updateClasses', { classes, index })"
          />
          <layer-legend :legend-url="factor.legendUrl" />
        </div>
      </transition>
    </div>
  </md-list>
</template>

<script>
import { LayerLegend } from '../'
import WeightFactor from '../weight-factor'
import InputRange from '../input-range'

export default {
  components: {
    LayerLegend,
    WeightFactor,
    InputRange,
  },
  props: {
    factors: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedFactorIndex: null,
    }
  },
  methods: {
    toggleFactorActivity(index) {
      this.$emit('toggleFactorActivity', { index, active: !this.factors[index].visible })
    },
    toggleSettings(index) {
      if (this.selectedFactorIndex === index) {
        this.selectedFactorIndex = null
        return
      }

      this.selectedFactorIndex = index
    },
  },
}
</script>

<style>
.susceptibility-list {
  position: relative;
  z-index: 10000;
}

.susceptibility-list__header {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.susceptibility-list__item-title {
  margin-left: var(--spacing-default);
  margin-right: auto;
}

.md-icon.icon-small {
  font-size: 20px !important;
  margin-right: 8px !important;
}

.list-item__settings {
  position: absolute;
  width: 250px;
  background-color: #fff;
  top: 0;
  right: -275px;
  z-index: 1000000;
  padding: var(--spacing-default);
  box-shadow: 1px 1px 10px #ccc;
}

.list-item__settings .md-subheader {
  padding: 0;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
</style>
