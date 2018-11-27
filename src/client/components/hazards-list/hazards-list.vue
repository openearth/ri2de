<template>
  <ul class="hazards-list">
    <li
      v-for="(hazard, index) in hazards"
      :key="hazard.title"
      class="hazards-list__list-item md-body"
    >
      <md-radio
        v-model="selectedHazard"
        :value="hazard.title"
        @change="() => $emit('select', index)"
      >
        {{ hazard.title }}
      </md-radio>
    </li>
  </ul>
</template>

 <script>
 export default {
  props: {
    hazards: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedHazard: '',
    }
  },
 }
 </script>

 <style>
 .hazards-list {
   padding: 0;
 }

 .hazards-list__list-item {
   list-style-type: none;
 }
 </style>

