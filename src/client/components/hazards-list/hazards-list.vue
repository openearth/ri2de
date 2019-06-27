<template>
  <form @submit.prevent="calculateTotals">
    <ul class="hazards-list">
      <li
        v-for="(hazard, hazardIndex) in hazards"
        :key="hazard.title"
        class="hazard-list__hazard md-primary"
      >
        <button
          :class="{'hazard-list__hazard-button--active': selectedHazardIndex === hazardIndex}"
          class="hazard-list__hazard-button"
          type="button"
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
                type="button"
                @click="onFactorClick(factorIndex)"
              >{{ factor.title }}</button>

              <weight-factor
                :min="factor.min"
                :max="factor.max"
                :step="factor.step"
                :weight-factor="factor.weightFactor"
                @onChange="(value) => $emit('setWeightFactor', { value, index: factorIndex })"
              />
            </div>
            <portal
              to="susceptibility-settings"
            >
              <susceptibility-settings
                v-if="selectedFactorIndex === factorIndex && selectedHazardIndex === hazardIndex"
                :key="`${factorIndex}-${hazardIndex}`"
                :factor="factor"
                :factor-index="factorIndex"
                :infrastructure="selections"
                @weightFactorChange="data => $emit('setWeightFactor', data)"
                @updateClasses="data => $emit('updateClasses', data)"
                @updateFactorLayer="data => $emit('updateFactorLayer', data)"
              />
            </portal>
          </li>
          <li>
            <md-button
              class="md-primary hazard-list__add-layer"
              type="button"
              @click="isLayerFormVisible = !isLayerFormVisible"
            >
              <md-icon class="md-primary hazard-list__add-layer__icon">add_circle_outline</md-icon>
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
    <button
      :disabled="calculatingSusceptibilityLayers || errorCalculatingSusceptibilityLayers"
      class="button button--primary button--full-width"
    >
      Calculate: {{ activeHazardTitle }}
    </button>
    <portal to="map-notification">
      <map-notification
        v-if="calculatingSusceptibilityLayers"
        :message="calculatingMessage"
      />
      <map-notification
        v-else-if="errorCalculatingSusceptibilityLayers"
        :message="errorMessage"
        type="error"
      />
    </portal>
  </form>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import SusceptibilitySettings from '../susceptibility-settings'
import LayerForm from '../layer-form'
import WeightFactor from '../weight-factor'
import MapNotification from '../map-notification'
import { selectionToCustomFactorLayer, generateWmsLayer, resetLayers } from '../../lib/project-layers'

export default {
  components: {
    SusceptibilitySettings,
    LayerForm,
    WeightFactor,
    MapNotification
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
    return {
      selectedFactorIndex: 0,
      expandSingle: true,
      isLayerFormVisible: false,
      isLoadingLayer: false,
      errorMessage: undefined,
      errorCalculatingSusceptibilityLayers: false,
      calculatingMessage: 'Calculating susceptibility layers...',
      calculatingSusceptibilityLayers: false,
    }
  },
  computed: {
    ...mapState('mapbox/selections', [ 'selections' ]),
    ...mapState('hazards', [ 'susceptibilityFactors', 'selectedHazardIndex', 'currentSusceptibilityFactors' ]),
    ...mapState('susceptibility-layers', [ 'layersPerSelection' ]),
    ...mapGetters('mapbox/selections', [ 'selectionsToRoadIds' ]),
    ...mapGetters('hazards', [ 'currentSusceptibilityFactors' ]),
    activeHazardTitle() {
      const activeHazard = this.hazards[this.selectedHazardIndex]
      return activeHazard ? activeHazard.title : ''
    }
  },
  async mounted() {
    this.getSelectionLayers()
  },
  beforeDestroy() {
    this.$store.dispatch('mapbox/wms/resetLayers')
  },
  methods: {
    ...mapActions({
      showError: 'notifications/showError',
      addSusceptibilityFactor: 'hazards/addSusceptibilityFactor',
    }),
    ...mapMutations({
      addSusceptibilityFactorForCurrentHazard: 'hazards/addSusceptibilityFactorForCurrentHazard'
    }),
    calculateTotals() {
      this.$router.push({ path: '/results' })
    },
    onHazardClick(index) {
      if (index === this.selectedHazardIndex) { return }

      this.$emit('select', index)
      this.selectedFactorIndex = 0
      this.getSelectionLayers()
      this.showCurrentLayer()
    },
    onFactorClick(index) {
      this.selectedFactorIndex = index
      this.showCurrentLayer()
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

        this.selectedFactorIndex = this.susceptibilityFactors[this.selectedHazardIndex].length - 1
        this.showCurrentLayer()
      } catch (err) {
        console.error(err)
        this.showError(err)
      }

      this.isLayerFormVisible = false
      this.isLoadingLayer = false
    },
    async showCurrentLayer() {
      const factorIndex = this.selectedFactorIndex

      this.currentSusceptibilityFactors.forEach((factor, index) => {
        const active = factorIndex === index

        this.$store.commit('hazards/updateFactorVisibility', {
          hazardIndex: this.selectedHazardIndex, index, visible: active
        })

        if(factor.factorLayers) {
          factor.factorLayers.forEach(layer => {
            this.$store.dispatch('mapbox/wms/setOpacity', {
              id: layer,
              opacity: active ? 1 : 0
            })
          })
        }
      })
    },
    getSelectionLayers() {
      const hazardIndex = this.selectedHazardIndex
      this.calculatingSusceptibilityLayers = true

      this.$store.dispatch('mapbox/wms/resetLayers')

      if (this.currentSusceptibilityFactors) {
        this.currentSusceptibilityFactors.forEach(async (factor, index) => {
          const factorLayers = this.selections.map(async selection => {
            const customFactorLayer = await selectionToCustomFactorLayer({ polygon: selection.polygon, factor, identifier: selection.identifier })
            const wmsLayer = generateWmsLayer(customFactorLayer)

            this.$store.dispatch('mapbox/wms/add', {
              ...wmsLayer,
              paint: { 'raster-opacity': index === 0 ? 1 : 0 },
            })
            this.$store.commit('susceptibility-layers/addLayerToSelection', {
              selectionId: selection.id,
              layer: { ...customFactorLayer, susceptibility: factor.title },
            })

            return wmsLayer.id
          })

          try {
            this.$store.commit('hazards/updateFactorLayers', {
              index, hazardIndex, factorLayers: await Promise.all(factorLayers)
            })
          } catch(e) {
            this.errorMessage = 'Error fetching the layers, reload and try again'
            this.errorCalculatingSusceptibilityLayers = true
            console.log('Error: ', e)
          }

          if(this.currentSusceptibilityFactors && index === this.currentSusceptibilityFactors.length - 1) {
            this.calculatingSusceptibilityLayers = false
          }
        })
      }
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
  cursor: pointer;
}

.hazard-list__hazard-button {
  display: flex;
  justify-content: space-between;
}

.hazard-list__hazard-button .md-icon {
  color: var(--neutral-color--light) !important;
  margin: 0;
}

.hazard-list__hazard-button--active .md-icon {
  transform: rotate(-90deg);
}

.hazard-list__add-layer__icon.md-icon {
  margin-right: 0.25rem;
}

.hazards-list__susceptiblity {
  background-color: #585657;
  color: var(--text-color);
  display: flex;
  align-items: center;
}

.hazards-list__susceptiblity-button {
  padding-left: 1.5rem;
  border: none;
}

.hazards-list__susceptiblity--active {
  background-color: var(--primary-color);
}

.hazard-list__add-layer .md-button-content {
  display: flex;
}
</style>

