<template>
  <div class="page-index">
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Welcome</md-dialog-title>

      <md-dialog-content>RI2DE helps users to visualize the effect of certain hazards on infrastructure.</md-dialog-content>

      <div class="page-index__actions">
        <md-button
          to="/project"
          class="md-raised md-primary"
        >
          New
        </md-button>
        <div class="page-index__divider" />
        <import-button />
      </div>

    </md-dialog>
  </div>
</template>

<script>
import ImportButton from '../../components/import-button'
import { mapState } from 'vuex';

export default {
  components: {
    ImportButton
  },
  data() {
    return {
      showDialog: true
    }
  },
  computed: {
    ...mapState('mapbox/selections', [ 'selections' ]),
  },
}
</script>

<style>
.page-index__actions {
  display: grid;
  grid-column-gap: var(--spacing-default);
  grid-template-columns: 1fr 1px 1fr;
  padding: 0 1rem 1rem;
}

.page-index__divider {
  width: 1px;
  height: 50px;
  background-color: lightgrey;
  flex: 1;
}
</style>
