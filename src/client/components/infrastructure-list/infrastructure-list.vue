<template>
  <transition-group
    name="infra-list"
    class="infrastructure-list"
    tag="ul"
  >
    <li
      v-for="(infra, index) in infrastructure"
      :key="infra.id"
      class="infrastructure-list__item"
      @mouseover="$emit('mouseover', index)"
      @mouseout="$emit('mouseout', index)"
    >
      <span class="infrastructure-list__item-description md-body-2">
        {{ infra.title }}
      </span>
      <md-button
        class="md-icon-button"
        @click="$emit('delete', index)"
      >
        <md-icon>delete</md-icon>
      </md-button>
    </li>
  </transition-group>
</template>

<script>
export default {
  props: {
    infrastructure: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style>
  .infrastructure-list {
    list-style: none;
    padding: 0;
  }

  .infrastructure-list__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: .2rem;
  }

  .infrastructure-list__item-description {
    flex-grow: 2;
  }

  .infra-list-enter, .infra-list-leave-to {
    opacity: 0;
  }

  .infra-list-enter-active, .infra-list-leave-active {
    transition: opacity .5s;
  }
</style>
