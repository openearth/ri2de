<template>
  <div class="layer-form">
    <md-dialog-title>Add a new layer</md-dialog-title>
    <form
      class="layer-form__form"
      @submit.prevent="() => $emit('addLayer', { url, name })"
    >
      <slot name="title" />
      <md-field>
        <label>Layer url</label>
        <md-input v-model="url" />
      </md-field>
      <md-field>
        <label>Layer name</label>
        <md-input v-model="name" />
      </md-field>
      <md-field>
        <label>Layer title</label>
        <md-input v-model="title" />
      </md-field>
    </form>
    <md-dialog-actions>
      <button
        class="button button--primary"
        @click="onSubmit"
      >
        Add layer
      </button>
    </md-dialog-actions>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: 'https://ri2de.openearth.eu/geoserver/ows?',
      name: 'albania:culverts_wgs84',
      title: 'Test',
    }
  },
  methods: {
    onSubmit() {
      this.$emit('addLayer', {
        owsUrl: this.url,
        layerName: this.name,
        title: this.title
      })
      this.url = ''
      this.name = ''
      this.title = ''
    }
  },
}
</script>

<style>
.layer-form {
  padding-top: 24px;
}

.layer-form__form {
  padding: 0 24px 1rem 24px;
  min-width: 400px;
}
</style>
