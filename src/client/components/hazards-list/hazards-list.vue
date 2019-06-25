<template>
  <ul class="hazards-list">
    <li
      v-for="(hazard, hazardIndex) in hazards"
      :key="hazard.title"
      class="hazard-list__hazard md-primary"
    >
      <button
        :class="{'hazard-list__hazard-button--active': selectedHazardIndex === hazardIndex}"
        class="hazard-list__hazard-button"
        @click="onHazardClick(hazardIndex)"
      >
        {{ hazard.title }}
        <md-icon>chevron_left</md-icon>
      </button>
      <ul
        v-if="selectedHazardIndex === hazardIndex"
        class="hazards-list__susceptiblities"
      >
        <li
          v-for="(factor, factorIndex) in susceptibilityFactors[hazardIndex]"
          :key="`${factorIndex}-${hazardIndex}`"
        >
          <div
            :class="{
              'hazards-list__susceptiblity--active': selectedFactorIndex === factorIndex && selectedHazardIndex === hazardIndex
            }"
            class="hazards-list__susceptiblity"
          >
            <button
              class="hazards-list__susceptiblity-button"
              @click="onFactorClick(factorIndex)"
            >{{ factor.title }}</button>
          </div>
          <portal
            to="susceptibility-settings"
          >
            <susceptibility-settings
              v-if="selectedFactorIndex === factorIndex && selectedHazardIndex === hazardIndex"
              :key="`${factorIndex}-${hazardIndex}`"
              :factor="factor"
              :factor-index="factorIndex"
              @weightFactorChange="data => $emit('setWeightFactor', data)"
              @updateClasses="data => $emit('updateClasses', data)"
              @close="selectedFactorIndex = null"
            />
          </portal>
        </li>
        <li>
          <md-button
            class="md-primary hazard-list__add-layer"
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
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import SusceptibilitySettings from '../susceptibility-settings'
import LayerForm from '../layer-form'
import { selectionToCustomFactorLayer, generateWmsLayer } from '../../lib/project-layers'

export default {
  components: {
    SusceptibilitySettings,
    LayerForm
  },
  props: {
    hazards: {
      type: Array,
      required: true,
    },
    initialSelection: {
      type: Number,
      required: false,
      default: undefined
    }
  },
  data() {
    const { hazards, initialSelection } = this
    const selectedHazard = hazards[initialSelection]
      ? hazards[initialSelection].title
      : undefined

    return {
      selectedHazard,
      selectedFactorIndex: 0,
      expandSingle: true,
      isLayerFormVisible: false,
      isLoadingLayer: false
    }
  },
  computed: {
    ...mapState('mapbox/selections', [ 'selections' ]),
    ...mapState('hazards', [ 'susceptibilityFactors', 'selectedHazardIndex' ]),
  },
  methods: {
    ...mapActions({
      showError: 'notifications/showError',
      addSusceptibilityFactor: 'hazards/addSusceptibilityFactor'
    }),
    ...mapMutations({
      addSusceptibilityFactorForCurrentHazard: 'hazards/addSusceptibilityFactorForCurrentHazard'
    }),
    onHazardClick(index) {
      this.selectedFactorIndex = 0
      this.$emit('select', this.selectedHazardIndex === index ? null : index)
    },
    onFactorClick(index) {
      this.selectedFactorIndex = this.selectedFactorIndex === index ? null : index
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
        console.error(err)
        this.showError(err)
      }

      this.isLayerFormVisible = false
      this.isLoadingLayer = false
    },
  }
}
</script>

<style>
.hazards-list, .hazards-list__susceptiblities {
  padding: 0;
  list-style-type: none;
}

.hazard-list__hazard {
  background-color: var(--text-color);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.hazard-list__hazard-button, .hazards-list__susceptiblity-button {
  width: 100%;
  padding: 1rem;
  background-color: none;
  text-align: left;
  font-size: 1rem;
  background-color: transparent;
  color: var(--neutral-color--light);
  border: none;
}

.hazard-list__hazard-button {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

.hazard-list__hazard-button .md-icon {
  color: var(--neutral-color--light) !important;
  margin: 0;
}

.hazard-list__hazard-button--active .md-icon {
  transform: rotate(-90deg);
}

.hazards-list__susceptiblity {
  background-color: #585657;
  color: var(--text-color);
}

.hazards-list__susceptiblity-button {
  padding-left: 1.5rem;
  border: none;
}

.hazards-list__susceptiblity--active {
  background-color: var(--primary-color);
}

.hazard-list__add-layer {
  padding-left: 2rem;
}

.hazard-list__add-layer .md-button-content {
  display: flex;
}
</style>

