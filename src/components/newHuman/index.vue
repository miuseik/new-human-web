<!--// 路径：src/views/home/components/Robot3d/index.vue-->
<template>
  <div class="three-box">
    <div class="menu">
      <Menu @sliderInput="modelAction" @switchChange="switchChange"
            @updateBoresList="updateBoresList"/>
    </div>
    <action @modelAction="modelAction" @sliderInput="sliderInput" :current-action="state.currentAction"></action>
    <div class="dot-warp">
      <div class="inner">
        <div class="dot" id="dot">
        </div>
        <div class="dot dot-mark">
        </div>
      </div>
    </div>
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
  dot          : null,
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
let x = 0
let y = 0
let z = 0

const setDot = (euler) => {
  let PI = 3 / (Math.PI / 2)
  // let PI = 1.5 / Math.PI
  const getServer = (val) => {
    let old_val = val || 0
    let new_val = parseInt(old_val * PI + 300)
    return new_val
  }
  x = euler.x
  y = euler.y
  z = euler.z
  let action = {
    x: 0,
    y: 0,
    z: 0,
  }
  let theta = x
  let theta_y = y * Math.cos(theta) - z * Math.sin(theta);
  let theta_z = y * Math.sin(theta) + z * Math.cos(theta);
  action.x = getServer(x * 100)
  action.y = getServer(theta_y * 100)
  action.z = getServer(theta_z * 100)
  state.dot.style.top = `${action.z / 6}px`
  state.dot.style.left = `${action.y / 6}px`
  return action
}
const modelAction = (name, eulerData) => {
  let action = {
    x: eulerData['_x'] || eulerData['x'],
    y: eulerData['_y'] || eulerData['y'],
    z: eulerData['_z'] || eulerData['z'],
  }
  if (name === "D2") {
     setDot(action)
    // action = setDot(action)
  }
  for (let key in action) {
    let item = action[key]
    sliderInput(item, name, key)
  }
};
const sliderInput = (e, name, direction) => {

  let option = state.joinTArr[name]['info']['option'][direction]
  let server_val = option.server_reverse ? e * -1 : e
  let model_val = option.model_reverse ? e * -1 : e
  emit("sliderInput", server_val, name, direction);
  base.setRobotRotation(model_val, name, direction);
};
const switchChange = (enabled) => {
  base.setControlsEnabled(enabled);
};
const updateBoresList = () => {
  base.initRobot();
};
onMounted(() => {
  state.dot = document.querySelector('#dot')
})
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

  .dot-warp {
    width: 100px;
    height: 100px;
    position: fixed;
    background-color: #060f14;
    border-radius: 50%;
    top: 40px;
    right: 0;

    .inner {
      border: #2DC3FE solid 1px;
      border-radius: 50%;
      width: 100%;
      height: 100%;
      position: relative;

      .dot {
        border: #2DC3FE solid 1px;
        background-color: #b3e19d;
        border-radius: 50%;
        width: 5px;
        height: 5px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
      }

      .dot-mark {
        background-color: red;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
      }
    }

    .dot {

    }
  }

}
</style>
