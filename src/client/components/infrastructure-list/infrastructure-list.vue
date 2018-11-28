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
        <input
          :value="infra.title"
          type="text"
          class="infrastructure-list__input"
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
    padding: .5rem;
    font-size: 14px;
    border: none;
    border-bottom: 1px solid #ccc;
    width: 100%;
  }
</style>
