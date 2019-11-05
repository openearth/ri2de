<template>
  <div class="add-hazard">
    <md-button
      class="md-raised md-primary"
      @click="showDialog = true"
    >Add hazard</md-button>

    <md-dialog
      :md-active.sync="showDialog"
    >
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
      susceptibilities: [{
          title: "Slope",
          wpsFunctionId: "ri2de_calc_slope",
          classes: [
            0,
            5,
            10,
            90
          ],
          layerName: "Global_Base_Maps:merit_gebco",
          owsUrl: "https://fast.openearth.eu/geoserver/ows?",
          keywords: [
            "elevation",
            "dem",
            "ahn"
          ],
          cswUrls: [
            "https://fast.openearth.eu/geonetwork/srv/eng/csw?"
          ]
        },
        {
          title: "Culverts presence",
          wpsFunctionId: "ri2de_calc_culverts",
          classes: [
            0,
            50,
            100,
            1000
          ],
          layerName: "limburg:culverts_4326",
          owsUrl: "https://ri2de.openearth.eu/geoserver/ows?",
          keywords: [],
          cswUrls: [
            "https://fast.openearth.eu/geonetwork/srv/eng/csw?"
          ]
        },
        {
          title: "Distance to water",
          wpsFunctionId: "ri2de_calc_water",
          classes: [
            0,
            100,
            200,
            1000
          ],
          layerName: "global_water_extent:global_water_jrc",
          owsUrl: "https://ri2de.openearth.eu/geoserver/ows?",
          keywords: [],
          cswUrls: [
            "https://fast.openearth.eu/geonetwork/srv/eng/csw?"
          ]
        },
        {
          title: "Soil type",
          wpsFunctionId: "ri2de_calc_soil",
          classes: [],
          layerName: ":",
          owsUrl: "https://fast.openearth.eu/geoserver/ows?",
          keywords: [],
          cswUrls: [
            "https://fast.openearth.eu/geonetwork/srv/eng/csw?"
          ]
        },
        {
          title: "Land use",
          wpsFunctionId: "ri2de_calc_landuse",
          classes: [],
          layerName: "global_landuse:GLOBCOVER_2009_wgs84",
          owsUrl: "https://ri2de.openearth.eu/geoserver/ows?",
          keywords: [],
          cswUrls: [
            "https://fast.openearth.eu/geonetwork/srv/eng/csw?"
          ]
        }
      ]
    }
  },
  async mounted() {
    this.loading = true
    try {
      const susceptibilities = await wps({ functionId: 'ri2de_susceptibilities' })

      this.susceptibilities = susceptibilities
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

.add-hazard .md-button {
  width: 100%;
  margin: 0;
}

.add-hazard__checkbox.md-checkbox {
  width: 100%;
  display: flex;
}
</style>