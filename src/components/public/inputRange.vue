<template>
  <div class="input-range">
    <input
        class="input-box"
        type="range" id="volume" name="volume"
        :value="state.innerValue"
        :min="min"
        :max="max"
        :step="0.01"
        @input="sliderInput"
    >
    <button class="btn btn-danger" @click="unadd">
      -
    </button>
    <button class="btn btn-warning" @click="add">
      +
    </button>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["sliderInput", "update:modelValue"]);

const props = defineProps({
  modelValue: {
    type   : [String, Number],
    default: 0,
  },
  value     : {
    type   : [String, Number],
    default: 0,
  },
  min       : {
    type   : [String, Number],
    default: 0,
  },
  max       : {
    type   : [String, Number],
    default: "",
  },
  total       : {
    type   : [String, Number],
    default: "",
  },
  step      : {
    type   : [String, Number],
    default: 0.01,
  },
});
const state = reactive({
  innerValue: props.modelValue
});
const add = () => {
  let num = Number(state.innerValue)
  num += Number(props.step)
  state.innerValue = num.toFixed(2);
  setInput()
  sliderInput()
}
const unadd = () => {
  let num = Number(state.innerValue)
  num -= Number(props.step)
  state.innerValue = num.toFixed(2);
  setInput()
  sliderInput()
}
const setInput = (e = {}) => {
  state.innerValue = e && e['target'] && e['target'].value || state.innerValue
  state.value = state.innerValue
  emit("sliderInput", state.innerValue );
}
const sliderInput = (e = {}) => {
  state.innerValue = e && e['target'] && e['target'].value || state.innerValue
  emit("update:modelValue", state.innerValue );
}
</script>

<style lang="scss" scoped>
.input-range {
  display: flex;
}

</style>