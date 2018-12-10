<template>
  <div
    :class="{'content-card--completed' : isCompleted, 'content-card--expanded' : isExpanded }"
    class="content-card card"
  >
    <md-card-header
      class="content-card__header"
      @click.native="$emit('selectCard', title)"
    >
      <div class="md-body-2">{{ title }}</div>
      <slot name="info" />
      <div
        v-if="isCompleted"
        class="content-card__header__icon"
      >
        <md-icon >done</md-icon>
      </div>
    </md-card-header>

    <div
      v-if="isExpanded"
      class="content-card__content"
    >
      <slot name="content" />
    </div>

    <div
      v-if="isExpanded"
      class="content-card__actions"
    >
      <slot name="actions" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    isExpanded: {
      type: Boolean,
      required: true,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style>
.md-card.content-card {
  border-radius: var(--border-radius--small);
}

.content-card--completed .content-card__header {
  background-color: #008FC5;
}

.content-card--expanded .content-card__header {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.content-card__header {
  background-color: var(--neutral-color);
  color: white;
  border-radius: var(--border-radius--small);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.md-card-header+.md-card-content.content-card__content {
  padding-bottom: 0;
}

.content-card__actions {
  padding: 20px;
}

.card {
  background-color: #fff;
  box-shadow: 0px 0px 8px #ccc;
  border-radius: 4px;
}

.content-card__content {
  padding: 0 20px;
}

.content-card__header__icon {
  background-color: #fff;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
