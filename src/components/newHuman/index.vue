<!--// 路径：src/views/home/components/Robot3d/index.vue-->
<template>
  <div class="three-box">
    <div class="menu">
      <Menu @sliderInput="modelAction" @switchChange="switchChange"
            @updateBoresList="updateBoresList"/>
    </div>
    <action @modelAction="modelAction" @sliderInput="sliderInput" :current-action="state.currentAction"></action>
      <div class="dot-warp" >
        <template v-for="(item, index) in state.specialJoints">
          <div class="inner">
            <div class="dot" :id="`dot_${item}`">
            </div>
            <div class="dot dot-mark">
            </div>
          </div>
        </template>
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
  dotArr          : {

  },
  joinTArr     : bores.joinTArr || {},
  currentAction: '',
  specialJoints:[
    'D2', 'D6'
  ]
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


const setDot = (name, euler) => {
  let PI = 3 / (Math.PI / 2)
  const getServer = (val) => {
    let old_val = val || 0
    let new_val = parseInt(old_val * PI + 300)
    return new_val
  }
  let x = euler.x.coordinate
  let y = euler.y.coordinate
  let z = euler.z.coordinate
  let theta = x
  let theta_y = y * Math.cos(theta) - z * Math.sin(theta);
  let theta_z = y * Math.sin(theta) + z * Math.cos(theta);
  let thetaData = {
    x: theta,
    y: theta_y,
    z: theta_z,
  }
  x = getServer(x * 100)
  y = getServer(theta_y * 100)
  z = getServer(theta_z * 100)
  console.log( `dot_${name}`, state.dotArr,  state.dotArr[name])
  state.dotArr[name].style.top = `${z / 6}px`
  state.dotArr[name].style.left = `${y / 6}px`
  return thetaData
}
const modelAction = (name, eulerData) => {
  let action = {
    x: {
      coordinate: eulerData['_x'] || eulerData['x'],
      euler: eulerData['_x'] || eulerData['x'],
    },
    y: {
      coordinate: eulerData['_y'] || eulerData['y'],
      euler: eulerData['_y'] || eulerData['y'],
    },
    z: {
      coordinate: eulerData['_z'] || eulerData['z'],
      euler: eulerData['_z'] || eulerData['z'],
    },
  }
  if (name === "D2" || name === "D6" ) {
    let new_action = setDot(name, action)
     action.x.coordinate = new_action.x
     action.y.coordinate = new_action.y
     action.z.coordinate = new_action.z
  }
  for (let key in action) {
    let option = state.joinTArr[name]['info']['option'][key]
    let item = action[key]
    sliderInput(item, name, key)
    driveServer(item['coordinate'], name, key, option)
    driveModel(item['euler'], name, key, option)
  }
};
const driveServer = (e, name, direction, option) => {
  let server_val =  180/Math.PI * e
  server_val = option.server_reverse ? server_val * -1 : server_val
  // console.log("sliderInput", server_val, name, direction);
  emit("sliderInput", server_val, name, direction);
}
const driveModel = (e, name, direction, option) => {
  let model_val = option.model_reverse ? e * -1 : e
  base.setRobotRotation(model_val, name, direction);
}
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
  let dom = document.getElementById("three_id");
  base = new myThree(dom);
  setTimeout(()=>{
    for(let item in state.specialJoints){
      let key = state.specialJoints[item]
      state.dotArr[key] = document.querySelector(`#dot_${key}`)
    }
    console.log('state.dotArr', state.dotArr)

  },500)
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
