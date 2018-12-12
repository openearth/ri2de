<template>
  <ul class="hazards-list">
    <li
      v-for="(hazard, index) in hazards"
      :key="hazard.title"
      class="hazards-list__list-item md-body"
    >
      <md-radio
        v-model="selectedHazard"
        :checked="selectedHazard === hazard.title"
        :value="hazard.title"
        class="md-primary"
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
    initialSelection: {
      type: Number,
      required: false,
      default: undefined
    }
  },
  data() {
    const { hazards, initialSelection } = this
    const selectedHazard = hazards[initialSelection]
      ? hazards[initialSelection].title
      : undefined

    return {
      selectedHazard,
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

