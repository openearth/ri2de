<template>
  <div class="add-hazard">
    <md-button
      class="md-raised md-primary"
      @click="showDialog = true"
    >Add hazard</md-button>

    <md-dialog
      :md-active.sync="showDialog"
      class="add-hazard__dialog"
    >
      <md-dialog-title class="add-hazard__dialog-title">Add custom hazard</md-dialog-title>
      <form @submit.prevent="onSubmit">
        <md-dialog-content>
          <md-progress-spinner
            v-if="loading"
            :md-diameter="30"
            :md-stroke="3"
            md-mode="indeterminate"
          />
          <template v-else>
            <md-field>
              <label>Hazard name</label>
              <md-input
                v-model="name"
                type="text"
                required
              />
            </md-field>

            <div>
              <label>Choose susceptibilities</label>
              <div>
                <md-checkbox
                  v-for="susceptibility in susceptibilities"
                  :key="susceptibility.wpsFunctionId"
                  :value="susceptibility"
                  v-model="selectedSusceptibilities"
                  class="add-hazard__checkbox"
                >{{ susceptibility.title }}</md-checkbox>
              </div>
            </div>
          </template>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button
            class="md-raised"
            @click="showDialog = false"
          >Cancel</md-button>
          <md-button
            type="submit"
            class="md-raised md-primary"
          >Save</md-button>
        </md-dialog-actions>
      </form>
    </md-dialog>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import wps from '../../lib/wps'

export default {
  data() {
    return {
      showDialog: false,
      name: '',
      selectedSusceptibilities: [],
      loading: false,
      susceptibilities: []
    }
  },
  async mounted() {
    this.loading = true
    try {
      const data = await wps({ functionId: 'ri2de_susceptibilities' })
      this.susceptibilities = data[0].susceptibilities
    } catch (err) {
      console.log(err)
    }
    this.loading = false
  },
  methods: {
    ...mapMutations({
      addHazard: 'hazards/addHazard',
      addSusceptibilityFactors: 'hazards/addSusceptibilityFactors',
    }),
    onSubmit() {
      const hazard = {
        title: this.name,
        name: this.name,
        type: 'hazard',
        layers: this.selectedSusceptibilities
      }

      this.addHazard(hazard)
      this.addSusceptibilityFactors(this.selectedSusceptibilities)
      this.showDialog = false
      this.name = ''
    }
  }
}
</script>

<style>
.add-hazard {
  padding: 1rem 0 0.25rem;
}

.add-hazard__dialog.md-dialog {
  min-width: 25rem;
}

.add-hazard__dialog-title.md-dialog-title {
  margin-bottom: 0;
}

.add-hazard .md-button {
  width: 100%;
  margin: 0;
}

.add-hazard__checkbox.md-checkbox {
  width: 100%;
  display: flex;
}
</style>