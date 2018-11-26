<template>
  <ul class="infrastructure-list">
    <li
      v-for="infra in infrastructure"
      :key="infra.id"
      class="infrastructure-list__item"
      @mouseover="$emit('mouseover', infra.id)"
      @mouseout="$emit('mouseout', infra.id)"
    >
      <span class="infrastructure-list__item-description">
        {{ infra.source.data.properties.roadid }}
        -
        {{ infra.source.data.properties.length_km }}
      </span>
      <button @click="$emit('delete', infra.id)" >delete</button>
    </li>
  </ul>
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
    margin: 1rem 0;
    padding: 0;
  }

  .infrastructure-list__item {
    display: flex;
    margin-bottom: .5rem;
    padding: .5rem;
  }

  .infrastructure-list__item-description {
    flex-grow: 2;
  }
</style>
