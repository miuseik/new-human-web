<template>
  <input
      type="range" id="volume" name="volume"
      v-model="state.innerValue"
      :min="min"
      :max="max"
      :step="0.01"
      @input="sliderInput()"
  >
</template>

<script lang="ts" setup>
const emit = defineEmits(["sliderInput"]);

const props = defineProps({
  value   : {
    type   : Number,
    default: 0,
  },
  min: {
    type   : Number,
    default: 0,
  },
  max  : {
    type   : [String, Number],
    default: "",
  },
});
const state = reactive({
  innerValue: props.value
});
const sliderInput = () => {
  emit("sliderInput", state.innerValue); //双向绑定,更新父组件当前页的值
  // console.log('innerValue', state.innerValue)

}
</script>

<style scoped>

</style>