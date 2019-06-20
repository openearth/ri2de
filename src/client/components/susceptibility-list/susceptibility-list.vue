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
              @click="toggleSettings(index)"
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
                  :value="[factor.classesValue[1], factor.classesValue[2]]"
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
    <md-button
      class="md-primary susceptibility-list__add-layer"
      @click="isLayerFormVisible = !isLayerFormVisible"
    >
      <md-icon class="md-primary susceptiblity-list__add-layer__icon">add_circle_outline</md-icon>
      <span class="md-body-2">Add a new layer</span>
    </md-button>
    <md-dialog
      :md-active.sync="isLayerFormVisible"
    >
      <layer-form
        :loading="isLoadingLayer"
        @addLayer="addLayer"
        @close="isLayerFormVisible = false"
      />
    </md-dialog>
  </div>
</template>

<script>
import { LayerLegend } from '../'
import WeightFactor from '../weight-factor'
import InputRange from '../input-range'
import LayerForm from '../layer-form'
import { selectionToCustomFactorLayer, generateWmsLayer } from '../../lib/project-layers'
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  components: {
    LayerLegend,
    LayerForm,
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
      isLayerFormVisible: false,
      isLoadingLayer: false
    }
  },
  computed: {
    ...mapState('mapbox/selections', [ 'selections' ]),
  },
  methods: {
    ...mapActions({
      showError: 'notifications/showError',
      addSusceptibilityFactor: 'hazards/addSusceptibilityFactor'
    }),
    ...mapMutations({
      addSusceptibilityFactorForCurrentHazard: 'hazards/addSusceptibilityFactorForCurrentHazard'
    }),
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
    async addLayer(newLayer) {
      this.isLoadingLayer = true

      try {
        const customFactorLayers = await Promise.all(this.selections.map( async selection => {
            const customLayer = await selectionToCustomFactorLayer({
              ...selection, factor: { wpsFunctionId: 'ri2de_calc_custom', classes: [], ...newLayer }
            })

            this.$store.dispatch('mapbox/wms/add', generateWmsLayer({
              ...customLayer, paint: { 'raster-opacity': 1 }
            }))

            this.$store.commit('susceptibility-layers/addLayerToSelection', {
              selectionId: selection.id, layer: { ...customLayer, susceptibility: newLayer.title },
            })

            return customLayer
        }))

        this.addSusceptibilityFactorForCurrentHazard({
          ...newLayer,
          factorLayers: customFactorLayers.map(layer => layer.id),
          weightFactor: 1,
          visible: true,
          wpsFunctionId: 'ri2de_calc_custom',
          isCustom: true
        })
      } catch (err) {
        this.showError(err)
      }

      this.isLayerFormVisible = false
      this.isLoadingLayer = false
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

.susceptibility-list__add-layer {
  margin-bottom: var(--spacing-default);
}

.susceptibility-list__add-layer .md-button-content {
  display: flex;
}

.susceptiblity-list__add-layer__icon.md-icon {
  margin-right: 0.25rem;
}
</style>
