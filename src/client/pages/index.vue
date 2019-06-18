<template>
  <md-dialog :md-active.sync="showDialog">
    <md-dialog-title>Welcome</md-dialog-title>

    <md-dialog-content>RI2DE helps users to visualize the effect of certain hazards on infrastructure.</md-dialog-content>

    <div class="page-index__import-button-wrapper">
      <md-button
        class="md-raised md-primary">
        {{ $t('import_exisiting_project') }}
      </md-button>
      <import-button />
    </div>

  </md-dialog>
</template>

<script>
import ImportButton from '../components/import-button'

export default {
  data() {
    return {
      showDialog: true
    }
  }
}
</script>
