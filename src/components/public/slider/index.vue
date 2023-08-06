<template>
  <div class="range">
    <div class="range-box">
      <template v-for="(item, index) in state.duration*1">
        <div class="range-item" @mouseover="checkStep(item)" @mousedown="mousedown(item)" @mouseup="mouseup(item)">
          <div class="dot current-step none-select" v-if="state.currentStep === item">
            <i class="none-select">{{ item }}</i>
          </div>
          <div class="grid none-select" :class="index%10 === 0 ? 'grid-10' : index%5 === 0 ? 'grid-5' : ''"></div>
        </div>
      </template>
    </div>

    <div class="option none-select">
      <div id="showTime">{{ state.showTime }}</div>
      <div class="btn btn-brand" id="startBn" @click="clickHandler('startBn')">{{ state.startBn }}</div>
      <div class="btn btn-brand" id="restBn" @click="clickHandler">复位</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import * as THREE from "three";
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'

const fbx_loader = new FBXLoader()
const emit = defineEmits(["sliderInput", "modelAction"]);
const props = defineProps({
  modelValue   : {
    type   : [String, Number],
    default: 0,
  },
  value        : {
    type   : [String, Number],
    default: 0,
  },
  currentAction: {
    type   : [String, Number],
    default: 0,
  },
  min          : {
    type   : [String, Number],
    default: 0,
  },
  max          : {
    type   : [String, Number],
    default: "",
  },
  step         : {
    type   : [String, Number],
    default: 0.01,
  },
});
const state = reactive({
  time     : '',
  showTime : '00:00:00',
  startBn  : "启动",
  restBn   : '',
  pauseDate: '',
  bool: false,
  pauseTime: 0,

  currentStep: 0,
  mixStep    : 0,
  isMouseDown: false,
  isStart    : false,
  isStartDemo: false,
  logAction  : [],
  duration   : 5000,
  quaternion : [],
  actions    : {
    // D1: {
    //   times    : {},
    //   values   : {},
    //   action   : {},
    //   key      : 1,
    //   direction: {
    //     "x": true,
    //     "y": true,
    //     "z": true,
    //   },
    //   index    : 0
    // },
    D2: {
      times    : {},
      values   : {},
      action   : {},
      key      : 45,
      direction: {
        "x": true,
        "y": true,
        "z": true,
      },
      index    : 0
    },
    D4: {
      times    : {},
      values   : {},
      action   : {},
      key      : 46,
      direction: {
        "x": true,
        "y": true,
        "z": true,
      },
      index    : 0
    },
    D6: {
      times    : {},
      values   : {},
      action   : {},
      key      : 49,
      direction: {
        "x": true,
        "y": true,
        "z": true,
      },
      index    : 0
    },
    D8: {
      times    : {},
      values   : {},
      action   : {},
      key      : 50,
      direction: {
        "x": true,
        "y": true,
        "z": true,
      },
      index    : 0
    },
  },
});


const resetAction = () => {
  for (let key in state.actions) {
    let item = state.actions[key]
    item.index = 0
  }
}
const setRange = (val, key) => {
  if (Math.abs(val) > Math.PI) {
    return val - (2 * Math.PI)
  }
  return val
}
let chunkArray = (arr, len, key) => {
  let chunks = Array.from({length: Math.ceil(arr.length / len)}, function (_, i) {
    let data = arr.slice(i * len, i * len + len)
    let x = data[0]
    let y = data[1]
    let z = data[2]
    let w = data[3]
    let quaternion = new THREE.Quaternion(x, y, z, w);
    let Euler = new THREE.Euler();
    let eulerData = Euler.setFromQuaternion(quaternion)
    if (key === 'D2' || key === 'D6') {
      eulerData['_z'] = eulerData['_z'] + Math.PI
    }
    eulerData['_x'] = setRange(eulerData['_x'], '_x')
    eulerData['_y'] = setRange(eulerData['_y'], '_y')
    eulerData['_z'] = setRange(eulerData['_z'], '_z')
    return eulerData;
  });
  return chunks;
}

const initModel = async () => {
  return new Promise(((resolve, reject) => {
    // fbx_loader.load('/Martelo 2.fbx', mesh => {
    // fbx_loader.load('/Standing Jump.fbx', mesh => {
    // fbx_loader.load('/Flair.fbx', mesh => {
    fbx_loader.load('/Catwalk Walk Forward Turn 90R.fbx', mesh => {
      // fbx_loader.load('/Strut Walking.fbx', mesh => {
      state.mixStep = 0
      let action = mesh.animations[0]['tracks']
      let duration = mesh.animations[0]['duration'] * 1000
      state.duration = parseInt(duration)
      resolve(action)
    })
  }))
}

const init = async () => {
  let action = await initModel()
  for (let key in state.actions) {
    let item = state.actions[key]
    item.times = action[item['key']]['times']
    let val = action[item['key']]['values']
    item.values = chunkArray(val, 4, key)
    item.times.forEach((data, index) => {
      item.action[data.toFixed(3).toString()] = item.values[index]
    })
  }
}
init()
watch(() => props.currentAction, val => {
  console.log(val)
}, {
  deep     : true,
  immediate: true
})
const mousedown = (item) => {
  state.isMouseDown = true
  checkStep(item)
}
const mouseup = (item) => {
  state.isMouseDown = false
  checkStep(item)
}
const jd = (hd) => {
  // 角度= 弧度 * 180 / Math.PI
  return hd * (180 / Math.PI)
}
const hd = (jd) => {
  // 弧度= 角度 * Math.PI / 180
  return jd * (Math.PI / 180)
}

const setAction = () => {
  for (let key in state.actions) {
    let item = state.actions[key]
    let time = (state.currentStep / 1000).toFixed(3)
    let eulerData = item['action'][time] || ''
    if (eulerData) {
      emit("modelAction", key, eulerData)
    }
  }
  state.mixStep = state.mixStep < state.currentStep ? state.currentStep : state.mixStep
}
const checkStep = (item) => {
  if (!state.isMouseDown) return
  state.currentStep = item
  setAction()
}

let timer
let timerOut
const start = () => {
  state.isStart = true
  timer = setInterval(() => {
    setAction()
    state.currentStep++
    if (state.currentStep >= state.duration) {
      state.mixStep = state.duration + 1
      reset()
      clearInterval(timer);
      start()
    }
  }, 16);
}
const stop = () => {
  state.isStart = false
  clearInterval(timer);
  clearTimeout(timerOut)
}
const reset = () => {
  resetAction()
  state.isStart = false
  state.currentStep = 0
  clearInterval(timer);
  clearTimeout(timerOut)
}
setInterval(animation, 1);

function animation() {
  if (!state.bool) return;
  //前时间减去上次开启时间减去暂停累计时间
  var times = new Date().getTime() - state.time - state.pauseTime;
  var minutes = Math.floor(times / 60000);//毫秒转化为分钟
  var seconds = Math.floor((times - minutes * 60000) / 1000);//已知分钟
  state.currentStep++
  console.log(state.currentStep)
  // 将time减去分钟 除去1000得出 秒
  var ms = Math.floor((times - minutes * 60000 - seconds * 1000) / 10);//
  state.showTime =
      (minutes < 10 ? "0" + minutes : minutes) + ":"
      + (seconds < 10 ? "0" + seconds : seconds) + ":"
      + (ms < 10 ? "0" + ms : ms);
}
//点击时的事件
function clickHandler(startBn) {
  console.log(state.actions)
  startBn = startBn || ''
  if (startBn) {
    state.bool = !state.bool;
    if (state.bool) {


      state.startBn = "暂停";
      state.pauseTime += (!state.pauseDate ? 0 : new Date().getTime() - state.pauseDate);
      if (state.time) return;
      state.time = new Date().getTime();
      return;//是为bool判断跳出
    }
    state.startBn = "启动";
    state.pauseDate = new Date().getTime();
    return;
  }
  state.pauseTime = 0;
  state.pauseDate = null;
  state.time = 0;
  state.showTime = "00:00:00";
}
</script>

<style lang="scss" scoped>

.range {
  width: 100%;


  .range-box {
    display: flex;
    justify-content: space-between;
    overflow: auto;

    .range-item {
      cursor: pointer;
      position: relative;

      .current-step {
        position: absolute;
        text-align: center;

        &:after {
          content: '';
          background-color: red;
          display: block;
          width: 5px;
          height: 5px;
        }
      }

      .grid {
        margin-top: 50px;
        width: 1px;
        height: 30px;
        display: flex;
        align-items: end;

        &:before {
          display: block;
          content: '';
          width: 1px;
          height: 2px;
          background-color: #000;
        }
      }

      .grid-5 {
        //height: 10px;
        &:before {
          height: 15px;
        }
      }

      .grid-10 {
        &:before {
          height: 30px;
        }
      }
    }
  }

  .option {
    display: flex;
    justify-content: center;

    .input-time {
      width: 100px;
    }
  }
}
#showTime {
  width: 300px;
  height: 60px;
  font-size: 60px;
  line-height: 60px;
}
</style>