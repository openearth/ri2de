<template>
  <ul class="hazard-list">
    <li
      v-for="(item, index) in list"
      :key="index"
      class="hazard-list__list-item md-body"
    >
      <md-radio
        v-model="selectedItem"
        :value="item"
        @change="() => $emit('select', item)"
      >
        {{ item }}
      </md-radio>
    </li>
  </ul>
</template>

 <script>
 export default {
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedItem: '',
    }
  },
 }
 </script>

 <style>
 .hazard-list {
   padding: 0;
 }

 .hazard-list__list-item {
   list-style-type: none;
 }
 </style>

