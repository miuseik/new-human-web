<template>
  <div class="input-range">
    <input
        type="range" id="volume" name="volume"
        v-model="state.innerValue"
        :min="min"
        :max="max"
        :step="0.01"
        @input="sliderInput()"
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
const emit = defineEmits(["sliderInput"]);

const props = defineProps({
  value: {
    type   : Number,
    default: 0,
  },
  min  : {
    type   : Number,
    default: 0,
  },
  max  : {
    type   : [String, Number],
    default: "",
  },
  step : {
    type   : [String, Number],
    default: 0.01,
  },
});
const state = reactive({
  innerValue: props.value
});
const add = () => {
  let num = Number(state.innerValue)
  num += Number(props.step)
  state.innerValue = num
  sliderInput()
}
const unadd = () => {
  let num = Number(state.innerValue)
  num -= Number(props.step)
  state.innerValue = num
  sliderInput()
}
const sliderInput = () => {
  emit("sliderInput", state.innerValue); //双向绑定,更新父组件当前页的值
  // console.log('innerValue', state.innerValue)

}
</script>

<style lang="scss" scoped>
.input-range {
  display: flex;
}

</style>