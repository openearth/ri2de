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
          :ref="infra.id"
          :value="infra.title"
          type="text"
          class="infrastructure-list__input md-body-2"
          @change="(e) => $emit('updateSelectionTitle', { title: e.target.value, selectionId: infra.id })"
        >
      </span>
      <md-button
        class="md-icon-button"
        @click="() => focus(infra.id)"
      >
        <md-icon>edit</md-icon>
      </md-button>
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
  },
  methods: {
    focus(id) {
      const element = this.$refs[id][0]
      element.focus()
    }
  },
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
    margin-bottom: var(--spacing-half);
  }

  .infrastructure-list__item-description {
    flex-grow: 1;
  }

  .infra-list-enter, .infra-list-leave-to {
    opacity: 0;
  }

  .infra-list-enter-active, .infra-list-leave-active {
    transition: opacity .5s;
  }

  .infrastructure-list__input {
    padding: var(--spacing-half);
    width: 100%;
    border: none;
    border-bottom: 1px solid transparent;
  }

  .infrastructure-list__input:focus {
    outline: none;
    border-bottom-color: var(--primary-color);
  }
</style>
