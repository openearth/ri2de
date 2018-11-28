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
      <span class="infrastructure-list__item-description">
        <input
          :value="infra.title"
          type="text"
          class="infrastructure-list__input md-body-2"
          @change="(e) => $emit('updateSelectionTitle', { title: e.target.value, selectionId: infra.id })"
        >
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

  .infrastructure-list__input {
    padding: var(--spacing-half);
    border: none;
    border-bottom: 1px solid transparent;
    width: 100%;
  }

  .infrastructure-list__input:focus {
    outline: none;
    border-bottom-color: #008FC5;
  }
</style>
