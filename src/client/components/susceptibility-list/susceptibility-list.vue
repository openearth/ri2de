<template>
  <md-card>
    <md-list class="susceptibility-list">
      <md-subheader class="susceptibility-list__header">
        Susceptibility factors
      </md-subheader>
      <md-divider />
      <div class="susceptibility-list__list">
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
            <span class="susceptibility-list__list-item__title">{{ factor.title }}</span>
            <md-button
              :class="{ 'md-raised' : selectedFactorIndex === index }"
              class="md-icon-button md-accent"
              @click="() => toggleSettings(index)"
            >
              <md-icon>keyboard_arrow_right</md-icon>
            </md-button>
          </md-list-item>
          <transition name="fade">
            <div
              v-if="selectedFactorIndex === index"
              class="susceptibility-list__list-item__settings"
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
                :value="[factor.classes[1], factor.classes[2]]"
                :min="factor.classes[0]"
                :max="factor.classes[3]"
                label="Classes"
                @updateClasses="classes => $emit('updateClasses', { classes, index })"
              />
              <layer-legend />
            </div>
          </transition>
        </div>
      </div>
    </md-list>
  </md-card>
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
}

.susceptibility-list__header {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.susceptibility-list__list {
  position: relative;
  padding: var(--spacing-default) 0;
}

.susceptibility-list__list-item__title {
  margin-left: var(--spacing-half);
  margin-right: auto;
  font-size: var(--font-size-default);
}

.susceptibility-list__list-item__settings {
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

.susceptibility-list__list-item__settings .md-subheader {
  padding: 0;
}
</style>
