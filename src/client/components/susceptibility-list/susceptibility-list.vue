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
      class="susceptibility-list__list-item"
    >
      <md-list-item>
        <md-button
          class="md-icon-button"
          @click="toggleFactorActivity(index)"
        >
          <md-icon :disabled="!activeFactorIndexes[index]">
            remove_red_eye
          </md-icon>
        </md-button>
        <span>{{ factor.title }}</span>
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
          <span>{{ factor.title }}</span>
          <weight-factor
            :min="factor.min"
            :max="factor.max"
            :step="factor.step"
            :weight-factor="factor.weightFactor"
            @onChange="(value) => $emit('setWeightFactor', { value, index })"
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

export default {
  components: {
    LayerLegend,
    WeightFactor,
  },
  props: {
    factors: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      activeFactorIndexes: this.factors.map(factor => true),
      selectedFactorIndex: null,
    }
  },
  methods: {
    toggleFactorActivity(index) {
      const activeFactors = [ ...this.activeFactorIndexes ]
      activeFactors[index] = !activeFactors[index]
      this.activeFactorIndexes = activeFactors
      this.$emit('toggleFactorActivity', { index, active: activeFactors[index] })
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
