<template>
  <transition-group
    v-if="infrastructure.length"
    name="fade"
    class="infrastructure-list"
    tag="ul"
  >
    <li
      v-for="(infra, index) in infrastructure"
      :key="infra.id"
      class="infrastructure-list__list-item"
      @mouseover="$emit('mouseover', index)"
      @mouseout="$emit('mouseout', index)"
    >
      <span class="infrastructure-list__list-item__title">
        <input
          :ref="infra.id"
          :value="infra.title"
          type="text"
          class="infrastructure-list__list-item__input md-body-2"
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

  <div
    v-else
    slot="content"
    class="infrastructure-list__description"
  >
    <md-icon
      :md-src="'/images/polygon.svg'"
      class="infrastructure-list__description__icon"
    />
    <p>Select the infrastructure you want to conduct calculations on</p>
  </div>
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

  .infrastructure-list__list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-half);
  }

  .infrastructure-list__list-item__description {
    flex-grow: 1;
  }

  .infrastructure-list__list-item__input {
    padding: var(--spacing-half);
    width: 100%;
    border: none;
    border-bottom: 1px solid transparent;
  }

  .infrastructure-list__list-item__input:focus {
    outline: none;
    border-bottom-color: var(--primary-color);
  }

  .infrastructure-list__description {
    display: flex;
    padding: var(--spacing-default) 0;
  }

  .infrastructure-list__description p {
    margin: 0;
  }

  .infrastructure-list__description__icon {
    margin: 0 !important;
    margin-right: var(--spacing-half) !important;
  }

  .infrastructure-list__description__icon svg {
    fill: #6D6D6D !important;
  }
</style>
