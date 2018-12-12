<template>
  <md-card
    :class="{'content-card--completed' : isCompleted, 'content-card--expanded' : isExpanded }"
    class="content-card card"
  >
    <md-card-header
      class="content-card__header"
      @click.native="$emit('selectCard', title)"
    >
      <div class="md-body-2">{{ title }}</div>
      <slot
        name="info"
        class="content-card__header__info"
      />
      <transition name="bounce">
        <div
          v-if="isCompleted"
          class="content-card__header__icon"
        >
          <md-icon >done</md-icon>
        </div>
      </transition>
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
  </md-card>
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
.content-card:not(:last-child) {
  margin-bottom: var(--spacing-default);
}

.content-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--neutral-color);
  color: #fff;
  border-radius: var(--border-radius--small);
}

.content-card--completed .content-card__header,
.content-card--expanded .content-card__header {
  background-color: var(--primary-color);
}

.content-card--expanded .content-card__header {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.content-card__header__info {
  margin-left: auto;
  margin-right: var(--spacing-default);
  color: #fff;
  opacity: .5;
}

.md-card-header+.md-card-content.content-card__content {
  padding-bottom: 0;
}

.content-card__actions {
  padding: var(--spacing-medium);
}

.content-card__content {
  padding: 0 var(--spacing-medium);
}

.content-card__header__icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  background-color: #fff;
  border-radius: 50%;
}

.bounce-enter, .bounce-leave-to {
  opacity: 0;
  transform: scale(0);
}

.bounce-enter-active, .bounce-leave-active {
  transition: transform .5s cubic-bezier(0,1.33,.44,.98);
}
</style>
