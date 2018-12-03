<template>
  <md-list class="susceptibility-list">
    <md-subheader class="susceptibility-list__header">
      Susceptibility factors
      <md-button class="md-dense">Reset</md-button>
    </md-subheader>
    <md-divider />
    <div
      v-for="(key, index) in Object.keys(factors)"
      :key="factors[key].id"
      class="susceptibility-list__list-item"
    >
      <md-list-item>
        <span class="md-caption">
          <md-icon class="icon-small">remove_red_eye</md-icon>
          {{ factors[key].title }}
        </span>
        <md-button
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
          <span>{{ factors[key].title }}</span>
          <weight-factor
            :min="factors[key].min"
            :max="factors[key].max"
            :step="factors[key].step"
            :weight-factor="factors[key].weightFactor"
            @onChange="(value) => $emit('setWeightFactor', { value, title: factors[key].title })"
          />
          <layer-legend :legend-url="factors[key].legendUrl" />
        </div>
      </transition>
    </div>
  </md-list>
</template>

<script>
import { LayerLegend } from '../'
import WeightFactor from '../weight-factor'

export default {
  components: {
    LayerLegend,
    WeightFactor
  },
  props: {
    factors: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedFactorIndex: null,
    }
  },
  methods: {
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

.md-icon.icon-small {
  font-size: 20px !important;
  margin-right: 8px !important;
}

.list-item__settings {
  position: absolute;
  width: 250px;
  height: 300px;
  background-color: #fff;
  top: 0;
  right: -275px;
  z-index: 1000000;
  padding: var(--spacing-default);
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.susceptibility-list__list-item {
  position: relative;
}
</style>
