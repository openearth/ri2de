<template>
  <div class="layer-form">
    <md-dialog-title>Add a new layer</md-dialog-title>
    <form @submit.prevent="onSubmit">
      <div class="layer-form__form">
        <slot name="title" />
        <md-field>
          <label>Layer url</label>
          <md-input
            v-model="url"
            required
          />
        </md-field>
        <md-field>
          <label>Layer name</label>
          <md-input
            v-model="name"
            required
          />
        </md-field>
        <md-field>
          <label>Layer title</label>
          <md-input
            v-model="title"
            required
          />
        </md-field>
      </div>
      <md-dialog-actions class="layer-form__actions">
        <md-button @click="$emit('close')">
          Cancel
        </md-button>
        <md-button
          :disabled="loading"
          class="md-raised md-accent"
          @click="onSubmit"
        >
          <md-progress-spinner
            v-if="loading"
            :md-diameter="20"
            :md-stroke="3"
            md-mode="indeterminate"
            class="md-white"
          />
          <span v-else>
            Add layer
          </span>
        </md-button>
      </md-dialog-actions>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
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

.layer-form .md-progress-spinner.md-theme-default .md-progress-spinner-circle {
  stroke: #FFF;
}

.layer-form__actions {
  display: flex;
  justify-content: flex-end;
}
</style>
