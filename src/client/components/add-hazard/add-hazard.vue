<template>
  <div class="add-hazard">
    <button @click="showDialog = true">Add hazard</button>

    <md-dialog
      :md-active.sync="showDialog"
    >
      <form @submit.prevent="onSubmit">
        <md-dialog-content>
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
        </md-dialog-content>
        <md-dialog-actions>
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

export default {
  data() {
    return {
      showDialog: false,
      name: '',
      selectedSusceptibilities: [],
      susceptibilities: [{
          "classes": [
            0,
            5,
            10,
            90
          ],
          "cswUrls": [
            "https://fast.openearth.eu/geonetwork/srv/eng/csw?"
          ],
          "keywords": [
            "elevation",
            "dem",
            "ahn"
          ],
          "layerName": "Global_Base_Maps:merit_gebco",
          "owsUrl": "https://fast.openearth.eu/geoserver/ows?",
          "title": "Slope",
          "wpsFunctionId": "ri2de_calc_slope"
        },
        {
          "classes": [
            0,
            50,
            100,
            1000
          ],
          "cswUrls": [
            "https://fast.openearth.eu/geonetwork/srv/eng/csw?"
          ],
          "keywords": [],
          "layerName": "limburg:culverts_4326",
          "owsUrl": "https://ri2de.openearth.eu/geoserver/ows?",
          "title": "Culverts presence",
          "wpsFunctionId": "ri2de_calc_culverts"
        },
        {
          "classes": [
            0,
            100,
            200,
            1000
          ],
          "cswUrls": [
            "https://fast.openearth.eu/geonetwork/srv/eng/csw?"
          ],
          "keywords": [],
          "layerName": "global_water_extent:global_water_jrc",
          "owsUrl": "https://ri2de.openearth.eu/geoserver/ows?",
          "title": "Distance to water",
          "wpsFunctionId": "ri2de_calc_water"
        },
        {
          "classes": [],
          "cswUrls": [
            "https://fast.openearth.eu/geonetwork/srv/eng/csw?"
          ],
          "keywords": [],
          "layerName": ":",
          "owsUrl": "https://fast.openearth.eu/geoserver/ows?",
          "title": "Soil type",
          "wpsFunctionId": "ri2de_calc_soil"
        }
      ]
    }
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
    }
  }
}
</script>

<style>
.add-hazard__checkbox.md-checkbox {
  width: 100%;
  display: flex;
}
</style>