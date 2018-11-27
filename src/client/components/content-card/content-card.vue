<template>
  <md-card
    :class="{'content-card--active' : isActive }"
    class="content-card"
  >
    <md-card-header class="content-card__header">
      <div class="md-body-2">{{ title }}</div>
    </md-card-header>

    <md-card-content
      v-if="isActive"
      class="content-card__content"
    >
      <slot name="content" />
    </md-card-content>

    <md-card-actions>
      <slot name="actions" />
    </md-card-actions>
  </md-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
}
</script>

<style>
.md-card.content-card {
  border-radius: var(--border-radius--small);
  width: var(--card-width);
}

.content-card--active .content-card__header {
  background-color: #008FC5;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.content-card__header {
  background-color: var(--neutral-color);
  color: white;
  border-radius: var(--border-radius--small);
}

.md-card-header+.md-card-content.content-card__content {
  padding-bottom: 0;
}
</style>
