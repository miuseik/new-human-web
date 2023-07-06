<!--// 路径：src/views/home/components/Robot3d/index.vue-->
<template>
  <div class="three-box">
    <div class="menu">
      <Menu @sliderInput="sliderInput" @switchChange="switchChange"
            @updateBoresList="updateBoresList"/>
    </div>
    <action @modelAction="modelAction" @sliderInput="sliderInput" :current-action="state.currentAction"></action>
    <canvas class="webgl" ref="webgl" id="three_id"></canvas>
  </div>
</template>
<script lang="ts" setup>
const emit = defineEmits(["sliderInput", "switchChange", "modelAction"]);
import myThree from "./index.js";
import Menu from "./Menu/index.vue";
import action from "./action/index.vue";

let base = null;
import boresStore from '@/store/bores/index.ts';

const bores = boresStore()
const state = reactive({
  joinTArr     : bores.joinTArr || {},
  currentAction: ''
})
watch(() => bores.joinTArr, val => {
  state.joinTArr = val
}, {
  deep     : true,
  immediate: true
})
watch(() => bores.motionData, val => {
  state.joinTArr = val
}, {
  deep     : true,
  immediate: true
})
onMounted(() => {
  let dom = document.getElementById("three_id");
  base = new myThree(dom);
});
const modelAction = (key, eulerData) => {
  // x = Math.cos(α) *Math.cos(β)
  // y = Math.sin(α) *Math.cos(β)
  // z = Math.sin(β)
  // 其中，α为偏航角，β为俯仰角，γ为翻滚角。

  // 例如，如果给定欧拉角为(30, 45, 60)，则该点在直角坐标系中的坐标为：
  // x = cos30° cos45° ≈ 0.3827
  // y = sin30° cos45° ≈ 0.3827
  // z = sin45° ≈ 0.7071
  // 因此，该点的坐标为(0.3827, 0.3827, 0.7071)。
  // console.log('eulerData', eulerData)
  let alpha  =eulerData['_x']
  let  beta =eulerData['_y']
  let x = Math.cos(alpha) *Math.cos(beta)
  let y = Math.sin(alpha) *Math.cos(beta)
  let z = Math.sin(beta)
  // console.log(key, 'x ------', x)
  // console.log(key, 'y ------', y)
  // console.log(key, 'z ------', z)
  // for(let item in eulerData){
  //   console.log(item)
  // }
  // emit("modelAction", key, eulerData);
  // let e, name, direction
  // sliderInput(e, name, direction)
};
const sliderInput = (e, name, direction) => {


  state.currentAction = e
  let option = state.joinTArr[name]['info']['option'][direction]
  let server_val = option.server_reverse ? e * -1 : e
  let model_val = option.model_reverse ? e * -1 : e
  emit("sliderInput", server_val, name, direction, option);
  base.setRobotRotation(model_val, name, direction);
};
const switchChange = (enabled) => {
  base.setControlsEnabled(enabled);
};
const updateBoresList = () => {
  base.initRobot();
};
// defineExpose({ setRobotRotation, setControlsEnabled });
</script>

<style lang="scss" scoped>
.three-box {
  display: flex;
  height: 100%;
  position: relative;

  .menu {
    background-color: rgba(0, 0, 0, .2);
    position: absolute;
    width: 15rem;
    height: 80vh;
    flex-shrink: 0;
    overflow: hidden;
    color: #fff;
    font-size: .7rem;
  }
}
</style>
