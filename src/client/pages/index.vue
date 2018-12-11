<template>
  <portal to="side-panel">
    <div>
      <div class="selection-steps">
        <content-card
          :is-expanded="activePage === 'index'"
          :is-completed="!!selections.length"
          title="Infrastructure"
          @selectCard="selectCard"
        >
          <infrastructure-list
            v-if="features.length"
            slot="content"
            :infrastructure="selections"
            @delete="deleteInfrastructure"
            @mouseover="(index) => updateInfrastructureStyle(index, infrastructureStyles.highlight)"
            @mouseout="(index) => updateInfrastructureStyle(index, infrastructureStyles.default)"
            @updateSelectionTitle="onUpdateSelectionTitle"
          />
          <div
            v-else
            slot="content"
            class="infrastructure-list__description"
          >
            <div class="infrastructure-list__description-icon" />
            <p>Select the infrastructure you want to conduct calculations on</p>
          </div>

          <button
            slot="actions"
            :disabled="selections.length === 0"
            class="button button--primary"
            @click="completeInfrastructure"
          >
            Next
          </button>
        </content-card>
        <content-card
          :is-expanded="activePage === 'hazards'"
          :is-completed="typeof selectedHazardIndex === 'number'"
          title="Hazards"
          @selectCard="selectCard"
        >
          <div
            v-if="typeof selectedHazardIndex === 'number'"
            slot="info"
            class="info"
          >
            {{ hazards[selectedHazardIndex].title }}
          </div>
          <hazards-list
            slot="content"
            :hazards="hazards"
            :initial-selection="selectedHazardIndex"
            @select="selectHazard"
          />
          <button
            slot="actions"
            :disabled="typeof selectedHazardIndex !== 'number'"
            class="button button--primary"
            @click="completeHazards"
          >
            Next
          </button>
        </content-card>
      </div>
      <div class="calculate-steps">
        <susceptibility-list
          v-if="activePage === 'susceptibilities'"
          :factors="currentSusceptibilityFactors"
          @setWeightFactor="onSetWeightFactor"
          @updateClasses="({ classes, index }) => onUpdateClasses(classes, index)"
          @toggleFactorActivity="toggleSusceptibilityLayer"
        />
        <nuxt-child/>
      </div>
    </div>
  </portal>
</template>

<script>
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'

import { globalRoads, wmsSelectionFromFactor } from '../lib/project-layers'
import initMapState from '../lib/mixins/init-map-state'
import layers from '../lib/_mapbox/layers'
import { getHazards, getSusceptibilityFactors } from '../lib/mock-api'

import { InfrastructureList, ContentCard, HazardsList, SusceptibilityList } from '../components'

const INFRASTRUCTURE_DEFAULT_COLOR = '#A34751'
const INFRASTRUCTURE_HIGHLIGHT_COLOR = '#FF0000'

export default {
  components: { InfrastructureList, ContentCard, HazardsList, SusceptibilityList },
  mixins: [ initMapState ],
  computed: {
    ...mapState([ 'activePage' ]),
    ...mapState('mapbox/features', [ 'features' ]),
    ...mapState('mapbox/selections', [ 'selections' ]),
    ...mapState('hazards', [ 'hazards', 'selectedHazardIndex', 'susceptibilityFactors' ]),
    ...mapGetters('hazards', [ 'currentSusceptibilityFactors' ]),
    infrastructureStyles() {
      return {
        default: INFRASTRUCTURE_DEFAULT_COLOR,
        highlight: INFRASTRUCTURE_HIGHLIGHT_COLOR,
      }
    }
  },
  mounted() {
    this.bootstrapHazardsList()
  },
  methods: {
    ...mapMutations({
      onUpdateSelectionTitle: 'mapbox/selections/updateTitle',
      selectHazard: 'hazards/selectHazard',
      updateWeightFactor: 'hazards/updateWeightFactor',
      updateClasses: 'hazards/updateClasses',
    }),
    ...mapActions({
      bootstrapHazardsList: 'hazards/bootstrapHazards'
    }),
    completeInfrastructure() {
      if(this.selections.length) {
        this.$router.push({ path: '/hazards' })
      }
    },
    completeHazards() {
      if(typeof this.selectedHazardIndex !== 'undefined' && this.selectedHazardIndex >= 0) {
        this.$router.push({ path: '/susceptibilities' })
      }
    },
    deleteInfrastructure(index) {
      const selection = this.selections[index]

      if(!selection) return

      this.$store.dispatch('mapbox/selections/delete', selection.id)
      selection.features.forEach(featureId => {
        this.$store.dispatch('mapbox/features/remove', featureId)
      })
    },
    initMapState() {
      this.$store.dispatch('mapbox/wms/add', globalRoads)

      this.features
        .forEach(feature => {
          this.$store.dispatch('mapbox/features/add', layers.geojson.line({
            id: feature.id,
            data: feature.source.data,
            paint: {
              'line-width': 5,
              'line-color': INFRASTRUCTURE_DEFAULT_COLOR,
              'line-opacity': 0.8,
            },
          }))
        })

      this.selections
        .map(selection => selection.polygon[0])
        .forEach(selection => {
          this.$store.dispatch('mapbox/selections/draw', selection)
        })
    },
    onSetWeightFactor({ value, index }) {
      this.updateWeightFactor({
        hazardIndex: this.selectedHazardIndex,
        susceptibilityIndex: index,
        weightFactor: value,
      })
    },
    onUpdateClasses(classes, index) {
      this.updateClasses({
        hazardIndex: this.selectedHazardIndex,
        susceptibilityIndex: index,
        classes,
      })
      this.updateSusceptibilityLayers({ susceptibilityIndex: index })
    },
    selectCard(title) {
      switch (title) {
        case 'Infrastructure':
          this.$router.push({ path: '/' })
          break

        case 'Hazards':
          this.$router.push({ path: '/hazards' })
          break

        default:
          break
      }
    },
    toggleSusceptibilityLayer({ index, active }) {
      const factor = this.currentSusceptibilityFactors[index]
      this.$store.commit('hazards/updateFactorVisibility', {
        hazardIndex: this.selectedHazardIndex, index, visible: active ? true : false
      })
      if(factor.factorLayers) {
        factor.factorLayers.forEach(layer => {
          this.$store.dispatch('mapbox/wms/setOpacity', {
            id: layer,
            opacity: active ? 1 : 0
          })
        })
      }
    },
    async updateSusceptibilityLayers({ susceptibilityIndex }) {
      const selectionPolygons = this.selections.map(selection => ({ polygon: selection.polygon[0], identifier: selection.identifier }))
      const susceptibility = this.currentSusceptibilityFactors[susceptibilityIndex]
      const layerPromises = selectionPolygons.map(polygon => {
        this.$store.dispatch('mapbox/wms/remove', `${polygon.polygon.id}-${susceptibility.title}`)
        return wmsSelectionFromFactor({ polygon: polygon.polygon, factor: susceptibility, identifier: polygon.identifier })
      })
      const layers = await Promise.all(layerPromises)

      layers.forEach(layer => this.$store.dispatch('mapbox/wms/add', layer))
    },
    updateInfrastructureStyle(index, style) {
      const infrastructure = this.selections[index]

      if(!infrastructure) return

      this.$store.dispatch('mapbox/features/setStyle', {
        id: infrastructure.features[0],
        styleOption: 'line-color',
        value: style,
      })
    },
  },
}
</script>

<style>
.content-card {
  margin-bottom: var(--spacing-default);
}

.info {
  margin-left: auto;
  margin-right: var(--spacing-default);
  color: #fff;
  opacity: .5;
}

.infrastructure-list__description-icon {
  position: relative;
  margin-right: var(--spacing-half);
  width: 30px;
  height: 30px;
  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIgICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiICAgd2lkdGg9IjIwIiAgIGhlaWdodD0iMjAiICAgdmlld0JveD0iMCAwIDIwIDIwIiAgIGlkPSJzdmcxOTE2NyIgICB2ZXJzaW9uPSIxLjEiICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45MStkZXZlbCtvc3htZW51IHIxMjkxMSIgICBzb2RpcG9kaTpkb2NuYW1lPSJzcXVhcmUuc3ZnIj4gIDxkZWZzICAgICBpZD0iZGVmczE5MTY5IiAvPiAgPHNvZGlwb2RpOm5hbWVkdmlldyAgICAgaWQ9ImJhc2UiICAgICBwYWdlY29sb3I9IiNmZmZmZmYiICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIgICAgIGJvcmRlcm9wYWNpdHk9IjEuMCIgICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIiAgICAgaW5rc2NhcGU6em9vbT0iMTEuMzEzNzA4IiAgICAgaW5rc2NhcGU6Y3g9IjExLjY4MTYzNCIgICAgIGlua3NjYXBlOmN5PSI5LjI4NTcxNDMiICAgICBpbmtzY2FwZTpkb2N1bWVudC11bml0cz0icHgiICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJsYXllcjEiICAgICBzaG93Z3JpZD0idHJ1ZSIgICAgIHVuaXRzPSJweCIgICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTI4MCIgICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9Ijc1MSIgICAgIGlua3NjYXBlOndpbmRvdy14PSIwIiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjIzIiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMCIgICAgIGlua3NjYXBlOm9iamVjdC1ub2Rlcz0idHJ1ZSI+ICAgIDxpbmtzY2FwZTpncmlkICAgICAgIHR5cGU9Inh5Z3JpZCIgICAgICAgaWQ9ImdyaWQxOTcxNSIgLz4gIDwvc29kaXBvZGk6bmFtZWR2aWV3PiAgPG1ldGFkYXRhICAgICBpZD0ibWV0YWRhdGExOTE3MiI+ICAgIDxyZGY6UkRGPiAgICAgIDxjYzpXb3JrICAgICAgICAgcmRmOmFib3V0PSIiPiAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+ICAgICAgICA8ZGM6dHlwZSAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4gICAgICAgIDxkYzp0aXRsZSAvPiAgICAgIDwvY2M6V29yaz4gICAgPC9yZGY6UkRGPiAgPC9tZXRhZGF0YT4gIDxnICAgICBpbmtzY2FwZTpsYWJlbD0iTGF5ZXIgMSIgICAgIGlua3NjYXBlOmdyb3VwbW9kZT0ibGF5ZXIiICAgICBpZD0ibGF5ZXIxIiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtMTAzMi4zNjIyKSI+ICAgIDxwYXRoICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiICAgICAgIHN0eWxlPSJjb2xvcjojMDAwMDAwO2Rpc3BsYXk6aW5saW5lO292ZXJmbG93OnZpc2libGU7dmlzaWJpbGl0eTp2aXNpYmxlO2ZpbGw6IzAwMDAwMDtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC41O21hcmtlcjpub25lO2VuYWJsZS1iYWNrZ3JvdW5kOmFjY3VtdWxhdGUiICAgICAgIGQ9Im0gNSwxMDM5LjM2MjIgMCw2IDIsMiA2LDAgMiwtMiAwLC02IC0yLC0yIC02LDAgeiBtIDMsMCA0LDAgMSwxIDAsNCAtMSwxIC00LDAgLTEsLTEgMCwtNCB6IiAgICAgICBpZD0icmVjdDc3OTciICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2NjY2NjY2NjY2NjY2NjIiAvPiAgICA8Y2lyY2xlICAgICAgIHN0eWxlPSJjb2xvcjojMDAwMDAwO2Rpc3BsYXk6aW5saW5lO292ZXJmbG93OnZpc2libGU7dmlzaWJpbGl0eTp2aXNpYmxlO2ZpbGw6IzAwMDAwMDtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MS42MDAwMDAwMjttYXJrZXI6bm9uZTtlbmFibGUtYmFja2dyb3VuZDphY2N1bXVsYXRlIiAgICAgICBpZD0icGF0aDQzNjQiICAgICAgIGN4PSI2IiAgICAgICBjeT0iMTA0Ni4zNjIyIiAgICAgICByPSIyIiAvPiAgICA8Y2lyY2xlICAgICAgIGlkPSJwYXRoNDM2OCIgICAgICAgc3R5bGU9ImNvbG9yOiMwMDAwMDA7ZGlzcGxheTppbmxpbmU7b3ZlcmZsb3c6dmlzaWJsZTt2aXNpYmlsaXR5OnZpc2libGU7ZmlsbDojMDAwMDAwO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxLjYwMDAwMDAyO21hcmtlcjpub25lO2VuYWJsZS1iYWNrZ3JvdW5kOmFjY3VtdWxhdGUiICAgICAgIGN4PSIxNCIgICAgICAgY3k9IjEwNDYuMzYyMiIgICAgICAgcj0iMiIgLz4gICAgPGNpcmNsZSAgICAgICBpZD0icGF0aDQzNzAiICAgICAgIHN0eWxlPSJjb2xvcjojMDAwMDAwO2Rpc3BsYXk6aW5saW5lO292ZXJmbG93OnZpc2libGU7dmlzaWJpbGl0eTp2aXNpYmxlO2ZpbGw6IzAwMDAwMDtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MS42MDAwMDAwMjttYXJrZXI6bm9uZTtlbmFibGUtYmFja2dyb3VuZDphY2N1bXVsYXRlIiAgICAgICBjeD0iNiIgICAgICAgY3k9IjEwMzguMzYyMiIgICAgICAgcj0iMiIgLz4gICAgPGNpcmNsZSAgICAgICBzdHlsZT0iY29sb3I6IzAwMDAwMDtkaXNwbGF5OmlubGluZTtvdmVyZmxvdzp2aXNpYmxlO3Zpc2liaWxpdHk6dmlzaWJsZTtmaWxsOiMwMDAwMDA7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjEuNjAwMDAwMDI7bWFya2VyOm5vbmU7ZW5hYmxlLWJhY2tncm91bmQ6YWNjdW11bGF0ZSIgICAgICAgaWQ9InBhdGg0MzcyIiAgICAgICBjeD0iMTQiICAgICAgIGN5PSIxMDM4LjM2MjIiICAgICAgIHI9IjIiIC8+ICA8L2c+PC9zdmc+);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top center;
}

.infrastructure-list__description-icon:after {
  position: absolute;
  content: '';
  width: 100%;
  height: 100%;
  background-color: #fff;
  opacity: .3;
}

.infrastructure-list__description {
  display: flex;
  padding: var(--spacing-default) 0;
}

.infrastructure-list__description p {
  margin: 0;
}

.selection-steps {
  background-color: var(--neutral-color--light);
  padding: var(--spacing-default);
  position: relative;
  --triangle-height: 30px;
  --triangle-width: 25px;
  margin-bottom: var(--triangle-height);
}

.selection-steps:after {
  position: absolute;
  bottom: calc(var(--triangle-height) * -1);
  left: calc(50% - calc(var(--triangle-width)/2));
  content: '';
  width: var(--triangle-width);
  height: var(--triangle-height);
  border-top: calc(var(--triangle-height)/2) solid var(--neutral-color--light);
  border-left: calc(var(--triangle-width)/2) solid transparent;
  border-right: calc(var(--triangle-width)/2) solid transparent;
}

.calculate-steps {
  padding: 0 var(--spacing-default);
}
</style>
