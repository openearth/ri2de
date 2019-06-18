<template>
  <header
    class="app-header"
    role="banner"
  >
    <md-toolbar class="md-primary app-header__md">
      <nuxt-link to="/project">
        <h1 class="md-title">RI2DE</h1>
      </nuxt-link>
      <div class="md-toolbar-section-end">
        <restart-button @click="$emit('restart')" />
        <save-button />
      </div>
    </md-toolbar>
  </header>
</template>

<script>
import RestartButton from '../restart-button'
import SaveButton from '../save-button'
import ImportButton from '../import-button'

export default {
  components: {
    RestartButton,
    SaveButton,
    ImportButton,
  },
}
</script>

<style>
  .app-header,
  .app-header__md {
    height: 64px;
    flex-basis: 100%;
  }
</style>
