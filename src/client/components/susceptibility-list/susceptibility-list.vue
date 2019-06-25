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

.susceptibility-list__add-layer .md-button-content {
  display: flex;
}

.susceptiblity-list__add-layer__icon.md-icon {
  margin-right: 0.25rem;
}
</style>
