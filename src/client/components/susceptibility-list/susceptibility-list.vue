<template>
  <div>
    <md-list class="susceptibility-list">
      <md-card>
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
                <div class="susceptibility-list__list-item__settings-wrapper">
                  <md-button
                    class="md-icon-button md-dense susceptibility-list__list-item__settings__button"
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
      </md-card>
    </md-list>
    <div>
      <button
        class="susceptibility-list__add-layer"
        @click="isLayerFormVisible = !isLayerFormVisible"
      >
        <md-icon class="md-primary susceptiblity-list__add-layer__icon">add_circle_outline</md-icon>
        <span class="md-body-2">Add a new layer</span>
      </button>
    </div>
    <layer-form
      :visible="isLayerFormVisible"
      @close="isLayerFormVisible = false"
      @addLayer="(newLayer) => {
        isLayerFormVisible = false
        $emit('addLayer', newLayer)
      }"
    />
  </div>
</template>

<script>
import { LayerLegend } from '../'
import WeightFactor from '../weight-factor'
import InputRange from '../input-range'
import LayerForm from '../layer-form'

export default {
  components: {
    LayerLegend,
    WeightFactor,
    InputRange,
    LayerForm,
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
      isLayerFormVisible: false,
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
  margin-bottom: var(--spacing-default) !important;
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

.susceptibility-list__list-item__settings-wrapper {
  position: relative;
}

.susceptibility-list__list-item__settings__button {
  position: absolute !important;
  top: calc(calc(var(--spacing-default) - 10px) * -1);
  right: calc(calc(var(--spacing-default) - 10px) * -1);
  margin: 0 !important;
}

.susceptibility-list__add-layer {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-half);
  background-color: #fff;
  border: none;
  box-shadow: none;
  font-family: inherit;
  color: var(--primary-color);
}

.susceptibility-list__add-layer:hover {
  cursor: pointer;
}

.susceptiblity-list__add-layer__icon{
  margin-right: var(--spacing-half);
}
</style>
