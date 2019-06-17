<template>
  <div>
    <md-list class="susceptibility-list">
      <md-subheader class="susceptibility-list__header">
        Susceptibility factors
      </md-subheader>
      <div class="susceptibility-list__list">
        <div
          v-for="(factor, index) in factors"
          :key="factor.id"
        >
          <md-list-item class="susceptibility-list__list-item">
            <md-button
              class="md-icon-button"
              @click="toggleFactorActivity(index)"
            >
              <md-icon :disabled="!factor.visible">
                {{ factor.visible ? 'visibility' : 'visibility_off' }}
              </md-icon>
            </md-button>
            <span class="susceptibility-list__list-item-title">{{ factor.title }}</span>
            <md-button
              :class="{ 'md-raised' : selectedFactorIndex === index }"
              class="md-icon-button md-accent susceptibility-list__list-item-button"
              @click="() => toggleSettings(index)"
            >
              <md-icon>keyboard_arrow_right</md-icon>
            </md-button>
          </md-list-item>
          <transition name="fade">
            <div
              v-if="selectedFactorIndex === index"
              class="susceptibility-list__list-item-settings"
            >
              <div class="susceptibility-list__list-item-settings-wrapper">
                <md-button
                  class="md-icon-button md-dense susceptibility-list__list-item-settings-button"
                  @click="selectedFactorIndex = null"
                >
                  <md-icon>clear</md-icon>
                </md-button>
                <weight-factor
                  :min="factor.min"
                  :max="factor.max"
                  :step="factor.step"
                  :weight-factor="factor.weightFactor"
                  @onChange="(value) => $emit('setWeightFactor', { value, index })"
                />
                <input-range
                  v-if="factor.classes && (factor.classes.length === 4)"
                  :value="[factor.classes[1], factor.classes[2]]"
                  :min="factor.classes[0]"
                  :max="factor.classes[3]"
                  label="Classes"
                  @updateClasses="classes => $emit('updateClasses', { classes, index })"
                />
                <layer-legend />
              </div>
            </div>
          </transition>
        </div>
      </div>
    </md-list>
  </div>
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
  z-index: 1;
  padding: var(--spacing-default) 0 !important;
}

.susceptibility-list__header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-bottom: .7rem !important;
  border-bottom: 1px solid #eee;
  background-color: transparent;
  font-size: 1rem !important;
  font-weight: bold;
}

.susceptibility-list__list {
  position: relative;
}

.susceptibility-list__list-item {
  border-bottom: 1px solid #eee;
}

.susceptibility-list__list .md-list-item-content {
  padding: .8rem 0;
}

.susceptibility-list__list-item-title {
  margin-right: auto;
  font-size: var(--font-size-default);
}

.susceptibility-list__list-item-button {
  margin: 0 20px !important;
}

.susceptibility-list__list-item-settings {
  --card-width: 270px;
  width: var(--card-width);
  position: absolute;
  top: 0;
  right: calc(calc(var(--card-width) * -1) - 25px);
  padding: var(--spacing-default);
  background-color: #fff;
  z-index: 2;
  box-shadow: 0 2px 5px 0 var(--neutral-color);
}

.susceptibility-list__list-item-settings .md-subheader {
  padding: 0;
}

.susceptibility-list__list-item-settings-wrapper {
  position: relative;
}

.susceptibility-list__list-item-settings-button {
  position: absolute !important;
  top: calc(calc(var(--spacing-default) - 10px) * -1);
  right: calc(calc(var(--spacing-default) - 10px) * -1);
  margin: 0 !important;
}
</style>
