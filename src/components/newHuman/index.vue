<!--// 路径：src/views/home/components/Robot3d/index.vue-->
<template>
  <div class="three-box">
    <div class="menu">
      <Menu @sliderInput="modelAction" @switchChange="switchChange"
            @updateBoresList="updateBoresList"/>
    </div>
    <action @modelAction="modelAction" :current-action="state.currentAction"></action>
    <div class="dot-warp">
      <template v-for="(item, index) in state.specialJoints">
        <div class="dot-box flex">
          <div class="inner inner-x">
            <div class="dot" :id="`dot_${item}_x`">
            </div>
          </div>
          <div class="inner">
            <div class="dot" :id="`dot_${item}`">
            </div>
            <div class="dot dot-mark">
            </div>
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
  dotArr       : {},
  joinTArr     : bores.joinTArr || {},
  currentAction: '',
  specialJoints: [
    'D2', 'D3', 'D4', 'D5'
  ],
  actions      : {}
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

const calculate = (range) => {
  const round = (x) => {
    return Math.round(x * 10000) / 100
  }
  let data = {
    0: {
      a: round(range['min']),
      b: 1,
      c: 100,
    },
    1: {
      a: round(range['max']),
      b: 1,
      c: 600,
    },
  }
  let res = {
    x: 0,
    y: 0
  }
  var a = parseFloat(data['0']['a']);
  var b = parseFloat(data['0']['b']);
  var c = parseFloat(data['1']['a']);
  var d = parseFloat(data['1']['b']);
  var p = parseFloat(data['0']['c']);
  var q = parseFloat(data['1']['c']);
  var dtr = a * d - b * c;
  var bx = a * q - c * p;
  var ax = p * d - q * b;
  if (dtr != 0) {
    res.x = (ax) / dtr;
    res.y = (bx) / dtr;
  } else {
    res.x = 0;
    res.y = 0;
  }
  res.x = Math.round(res.x * 10000) / 10000
  res.y = Math.round(res.y * 10000) / 10000
  return res
}
const setDot = (name, euler, options) => {
  const getServer = (val, res) => {
    let old_val = val || 0
    let new_val = parseInt(old_val * res['x'] + res['y'])
    return new_val
  }
  let x = euler.x.coordinate
  let x_res = calculate(options['x'])
  let y = euler.y.coordinate
  let y_res = calculate(options['y'])
  let z = euler.z.coordinate
  let z_res = calculate(options['z'])
  let theta = x
  let theta_y = y * Math.cos(theta) - z * Math.sin(theta);
  let theta_z = y * Math.sin(theta) + z * Math.cos(theta);

  x = getServer(x * 100, x_res)
  y = getServer(theta_y * 100, y_res)
  z = getServer(theta_z * 100, z_res)
  let thetaData = {
    x: x,
    y: y,
    z: z,
  }
  if (state.specialJoints.includes(name)) {
    state.dotArr[`${name}_x`].style.top = `${(x-100) / 5}px`
    state.dotArr[name].style.top = `${(z-100) / 5}px`
    state.dotArr[name].style.left = `${(y-100) / 5}px`
  }
  return thetaData
}
const modelAction = (name, eulerData) => {
  let action = {
    x: {
      coordinate: eulerData['_x'] || eulerData['x'],
      euler     : eulerData['_x'] || eulerData['x'],
    },
    y: {
      coordinate: eulerData['_y'] || eulerData['y'],
      euler     : eulerData['_y'] || eulerData['y'],
    },
    z: {
      coordinate: eulerData['_z'] || eulerData['z'],
      euler     : eulerData['_z'] || eulerData['z'],
    },
  }
  let options = state.joinTArr[name]['info']['option']
  let dot_action = setDot(name, action, options)
  // return
  action.x.coordinate = dot_action.x
  action.y.coordinate = dot_action.y
  action.z.coordinate = dot_action.z
  // console.log('state.actions',state.actions)
  // console.log(JSON.stringify(action))

  for (let key in action) {
    let item = action[key]
    let val = state.actions[name] && state.actions[name][key] || 0
    // if (val !== item['coordinate']) {
      driveServer(item['coordinate'], name, key, options)
      state.actions[name] = dot_action
    // }
    driveModel(item['euler'], name, key, options)
  }
};
const driveServer = (e, name, direction, options) => {
  let option = options[direction]
  let server_val = e
  if (direction === 'x'){
    console.log(e, name, direction, options)
    console.log(700 - server_val)
  }
  server_val = option.server_reverse ? 700 - server_val : server_val
  emit("sliderInput", server_val, name, direction);
}
const driveModel = (e, name, direction, options) => {
  let option = options[direction]
  let model_val = option.model_reverse ? e * -1 : e
  base.setRobotRotation(model_val, name, direction);
  // console.log('setDot',model_val, e, name, direction)
}

const switchChange = (enabled) => {
  base.setControlsEnabled(enabled);
};
const updateBoresList = () => {
  base.initRobot();
};

onMounted(() => {
  let dom = document.getElementById("three_id");
  base = new myThree(dom);
  setTimeout(() => {
    for (let item in state.specialJoints) {
      let key = state.specialJoints[item]
      state.dotArr[key] = document.querySelector(`#dot_${key}`)
      state.dotArr[`${key}_x`] = document.querySelector(`#dot_${key}_x`)
    }
    console.log('state.dotArr', state.dotArr)
  }, 500)
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
    position: fixed;
    border-radius: 50%;
    top: 40px;
    right: 0;

    .dot-box {
      .inner {
        background-color: #060f14;
        border: #2DC3FE solid 1px;
        border-radius: 50%;
        width: 100px;
        height: 100px;
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

      .inner-x {
        width: 10px;
        border-radius: 5px;

      }
    }


    .dot {

    }
  }

}
</style>
