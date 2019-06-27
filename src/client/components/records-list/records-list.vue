<template>
  <div >
    <md-list class="records-list">
      <div
        v-for="record in recordslist"
        :key="record.title"
        class="records-list__list"
      >
        <div class="records-list__list-item" >
          <div class="records-list__item-header">
            <h2 class="md-title">{{ record.title }}</h2>

            <md-button
              class="md-accent md-raised"
              @click="changeLayer(record)"
            >
              Select
            </md-button>
          </div>

          <p class="md-body-1">
            {{ record.abstract }}
          </p>
    
          <md-divider />
        </div>
      </div>
    
    </md-list>
  </div>  
</template>

<script>
export default {
  props:{
    recordslist:{
      type:Array,
      required:true
    },
  },
  methods: {
    changeLayer(updatedlayer) {
      this.$emit('updateFactorLayer', updatedlayer)
    }
  }
}
</script>
<style>
.md-list{
  width:500px;
  max-width: 100%;
  display:inline-block;
  vertical-align: top;
}

.records-list__item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>