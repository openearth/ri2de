<template>
  <div class="full-control">
    <div class="list">
      <md-list
        :md-expand-single="expandSingle"
        theme="dark"
      >
        <md-list-item
          v-for="(hazard, hazardIndex) in hazards"
          :key="hazard.title"
          md-expand
        >
          <span class="md-list-item-text">{{ hazard.title }}</span>

          <md-list slot="md-expand">
            <md-list-item
              v-for="(factor, factorIndex) in susceptibilityFactors[hazardIndex]"
              :key="factorIndex"
              @click="selectedFactorIndex = factorIndex"
            >
              {{ factor.title }}
              <portal
                to="susceptibility-settings"
              >
                <susceptibility-settings
                  v-if="selectedFactorIndex === factorIndex"
                  :factor="factor"
                  :factor-index="factorIndex"
                  @weightFactorChange="data => $emit('setWeightFactor', data)"
                  @updateClasses="data => $emit('updateClasses', data)"
                  @close="selectedFactorIndex = null"
                />
              </portal>
            </md-list-item>
          </md-list>
        </md-list-item>
      </md-list>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SusceptibilitySettings from '../susceptibility-settings'

export default {
  components: {
    SusceptibilitySettings
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
      selectedFactorIndex: null,
      expandSingle: true
    }
  },
  computed: {
    ...mapState({
      susceptibilityFactors: state => state.hazards.susceptibilityFactors
    })
  },
  methods: {
    onHazardClick(title) {
      this.selectedHazard = title
    }
  }
}
</script>

<style>
.hazards-list {
  padding: 0;
}

.hazards-list__list-item {
  list-style-type: none;
}

.hazards-list__card-header {
  display: flex;
  justify-content: space-between;
}

.hazards-list__card-header .md-icon {
  margin: 0;
  color: var(--neutral-color--light) !important;
}

.hazards-list__card-title {
  font-size: 1rem;
}

.hazards-list__header-icon--active {
  transform: rotate(-90deg);
}

.hazard-list__susceptibility-button {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}
 </style>

