<template>
  <md-dialog :md-active.sync="visible">
    <md-dialog-title>Add a new layer</md-dialog-title>
    <form
      class="layer-form"
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
  </md-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      url: '',
      name: '',
      title: '',
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
  padding: 0 20px 1rem 20px;
  min-width: 400px;
}
</style>
