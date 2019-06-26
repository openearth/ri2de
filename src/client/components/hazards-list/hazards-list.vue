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
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import SusceptibilitySettings from '../susceptibility-settings'
import LayerForm from '../layer-form'
import { selectionToCustomFactorLayer, generateWmsLayer, resetLayers } from '../../lib/project-layers'

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
    return {
      selectedFactorIndex: 0,
      expandSingle: true,
      isLayerFormVisible: false,
      isLoadingLayer: false,
      errorMessage: undefined,
    }
  },
  computed: {
    ...mapState('mapbox/selections', [ 'selections' ]),
    ...mapState('hazards', [ 'susceptibilityFactors', 'selectedHazardIndex', 'currentSusceptibilityFactors' ]),
    ...mapState('susceptibility-layers', [ 'layersPerSelection' ]),
    ...mapGetters('mapbox/selections', [ 'selectionsToRoadIds' ]),
  },
  mounted() {
    this.getSelectionLayer()
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
      if (index !== this.selectedHazardIndex) {
        this.selectedFactorIndex = 0
        this.getSelectionLayer()
      }
      this.$emit('select', index)
    },
    onFactorClick(index) {
      this.selectedFactorIndex = index
      this.getSelectionLayer()
    },
    async addLayer(newLayer) {
      this.isLoadingLayer = true

      this.$store.dispatch('mapbox/wms/resetLayers')

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
      } catch (err) {
        console.error(err)
        this.showError(err)
      }

      this.isLayerFormVisible = false
      this.isLoadingLayer = false
    },
    async getSelectionLayer() {
      const hazardIndex = this.selectedHazardIndex
      const factorIndex = this.selectedFactorIndex
      const selectedHazard = this.susceptibilityFactors[hazardIndex]

      if (selectedHazard) {
        const selectedSusceptibility = selectedHazard[factorIndex]

        this.$store.dispatch('mapbox/wms/resetLayers')

        const factorLayers = await Promise.all(this.selections.map(async selection => {
          const customFactorLayer = await selectionToCustomFactorLayer({
            polygon: selection.polygon,
            factor: selectedSusceptibility,
            identifier: selection.identifier
          })

          const wmsLayer = generateWmsLayer(customFactorLayer)

          this.$store.dispatch('mapbox/wms/add', {
            ...wmsLayer,
            paint: { 'raster-opacity': 1 },
          })

          this.$store.commit('susceptibility-layers/addLayerToSelection', {
            selectionId: selection.id,
            layer: { ...customFactorLayer, susceptibility: selectedSusceptibility.title },
          })

          return wmsLayer.id
        }))

        try {
          this.$store.commit('hazards/updateFactorVisibility', {
            index: factorIndex, hazardIndex, visible: true
          })

          this.$store.commit('hazards/updateFactorLayers', {
            index: factorIndex, hazardIndex, factorLayers
          })
        } catch(e) {
          this.errorMessage = 'Error fetching the layers, reload and try again'
          console.log('Error: ', e)
        }
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

.hazard-list__add-layer .md-button-content {
  display: flex;
}
</style>

