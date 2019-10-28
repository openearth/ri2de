<template>
  <div class="add-source">
    <div>
      <md-button
        class="md-primary"
        @click="showDialog"
      >
        change source
      </md-button>

      <md-dialog :md-active.sync="open">
        <div class="add-source__title">
          <md-dialog-title>Select data source for slope susceptibility</md-dialog-title>
        </div>

        <md-dialog-content>
          <div
            v-if="loading"
            class="add-source__loader"
          >
            <md-progress-spinner
              :md-diameter="30"
              :md-stroke="3"
              md-mode="indeterminate"
            />
          </div>
          <records-list
            v-else
            :recordslist="records"
            :openstate="open"
            @updateFactorLayer="onUpdateFactorLayer"
          />
        </md-dialog-content>

        <md-dialog-actions>
          <div class="add-source__actions">
            <md-button
              class="md-primary"
              @click="open = false"
            >Close</md-button>
          </div>
        </md-dialog-actions>
      </md-dialog>
    </div>
  </div>

</template>


<script>
import wps from '../../lib/wps'
import RecordsList from '../records-list'

export default{
  components: {
    RecordsList
  },
  props:{
   keywords:{
     type:Array,
   required:true
    },
   roadsid:{
     type:String,
    required:true
   },
   csw:{
     type:Array,
    required:true
   },
  },
  data() {
    return {
      open: false,
      records: [],
      loading: false
    }
  },
  methods: {
    showDialog() {
      this.records = []
      this.wpsGetRecords()
      this.open = true
    },
    async wpsGetRecords() {
      const keyword_array=this.keywords
      const identifier=this.roadsid
      const cswUrls=this.csw
      this.loading = true
      const wpsResponse = await wps({
        functionId: "getrecords_url",
        filterData: {
          keywords: keyword_array,
        },
        roadsIdentifier:identifier,
        cswUrls:{
          csw: cswUrls
        }
      })

      this.loading = false
      this.records = wpsResponse
    },
    onUpdateFactorLayer(data){
      this.$emit('updateFactorLayer', data)
      this.open = false
    },
  }
}

</script>
<style>
.add-source__title {
  background-color: var(--primary-color);
  font-size: 16px;
  font-weight: bold;
  color:white;
  padding: 1rem 0;
}

.add-source__actions {
  padding-top: 1rem;
}

.add-source__loader {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 2rem;
}
</style>


