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
      <div id="showTime">{{ state.demoNum }}</div>
      <div class="btn btn-brand" @click="start" v-if="!state.isStart">开始</div>
      <div class="btn btn-brand" @click="stop" v-else>停止</div>
      <div class="btn btn-brand" @click="reset">复位</div>
      <div class="btn btn-brand" @click="actionTick">actionTick()</div>
      <div class="btn btn-brand" @click="state.stopTick=true">tick()</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import * as THREE from "three";
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import {cloneDeep, debounce} from "@/utils/putlic/index.js"
import {boneData} from "@/components/newHuman/data/index.js"
import {ElMessage} from "element-plus";

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
  time        : null,
  stopTick    : false,
  showTime    : '00:00:00',
  startBn     : "启动",
  restBn      : '',
  pauseDate   : null,
  bool        : false,
  pauseTime   : 0,
  demoNum     : 0,
  currentStep : 0,
  currentTime : null,
  mixStep     : 0,
  isMouseDown : false,
  isStart     : false,
  isStartDemo : false,
  logAction   : [],
  duration    : 5000,
  quaternion  : [],
  actionsClone: {},
  actions     : {},
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
  let _chunks = Array.from({length: Math.ceil(arr.length / len)}, function (_, i) {
    let data = arr.slice(i * len, i * len + len)
    let x = data[0]
    let y = data[1]
    let z = data[2]
    let w = data[3]
    let quaternion = new THREE.Quaternion(x, y, z, w);
    let Euler = new THREE.Euler();
    let eulerData = Euler.setFromQuaternion(quaternion)
    if (key === 'D2' || key === 'D4') {
      eulerData['_z'] = eulerData['_z'] + Math.PI
    }
    if (key === 'D6' || key === 'D7') {
      eulerData['_x'] = eulerData['_x'] - Math.PI/2
    }
    if (key === 'D10' || key === 'D11'|| key === 'D12'|| key === 'D13'|| key === 'D14'|| key === 'D15'|| key === 'D16'|| key === 'D17'|| key === 'D18'|| key === 'D19') {
      eulerData['_x'] = eulerData['_x'] - Math.PI/4
    }
    eulerData['_x'] = setRange(eulerData['_x'], '_x')
    eulerData['_y'] = setRange(eulerData['_y'], '_y')
    eulerData['_z'] = setRange(eulerData['_z'], '_z')
    return eulerData;
  });
  return _chunks;
}

const initModel = async () => {
  return new Promise(((resolve, reject) => {
    // fbx_loader.load('/Martelo 2.fbx', mesh => {
    //   fbx_loader.load('/Standing Jump.fbx', mesh => {
    //   fbx_loader.load('/Flair.fbx', mesh => {
    //   fbx_loader.load('/Catwalk Walk Forward Turn 90R.fbx', mesh => {
    //   fbx_loader.load('/Strut Walking.fbx', mesh => {
      fbx_loader.load('/Walking.fbx', mesh => {
      state.mixStep = 0
      console.log('meshmeshmesh', mesh.animations)
      let action = mesh.animations[0]['tracks']
      let duration = mesh.animations[0]['duration'] * 1000
      state.duration = duration
      resolve(action)
    })
  }))
}

const init = async () => {
  state.actions = boneData['actions']
  state.actions = boneData['actions']
  let action = await initModel()
  for (let key in state.actions) {
    let item = state.actions[key]
    for (let i in action[item['key']]['times']) {
      item.times.push(action[item['key']]['times'][i])
    }
    let val = action[item['key']]['values']
    item.values = chunkArray(val, 4, key)
    item.times.forEach((data, index) => {
      item.action[data.toFixed(3).toString()] = item.values[index]
    })
  }
}
init()
watch(() => props.currentAction, val => {
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
    let direction = item.direction
    let time = (state.currentStep / 1000).toFixed(3)
    let eulerData = item['action'][time] || ''
    if (eulerData) {
      !direction.x ? eulerData['_x'] = 0 : ''
      !direction.y ? eulerData['_y'] = 0 : ''
      !direction.z ? eulerData['_z'] = 0 : ''
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
const worker = new Worker("worker.js");
const demoStop = () => {
  worker.postMessage({
    key : "stop",
    data: state.currentStep
  });
}
let timer
const start = () => {
  state.isStart = true
  worker.postMessage({
    key : "start",
    data: state.currentStep
  });
  worker.onmessage = function (event) {
    state.currentStep = event.data
    setAction()
    if (state.currentStep >= state.duration) {
      demoStop()
      console.log('en')
      loopAction()
    }
  }
}
let clock

function tick() {
  const time = clock.getElapsedTime()
  console.log(time)
  if (state.stopTick) return
  requestAnimationFrame(tick)
}

function actionTick() {
  state.stopTick = false
  clock = new THREE.Clock()
  tick()
}

const loopAction = debounce(() => {
  console.log('ha')
  state.mixStep = state.duration + 1
  reset()
  // clearInterval(timer);
  start()
}, 20);
const stop = () => {
  state.isStart = false
  // clearInterval(timer);
  // demoStop()
}
const reset = () => {
  resetAction()
  state.isStart = false
  state.currentStep = 0
  // clearInterval(timer);
  // demoStop()
}


const setAc = () => {
  for (let key in state.actionsClone) {
    let item = state.actionsClone[key]
    let currentTime = parseFloat((1000 / state.currentTime).toFixed(3))
    let time
    if (item['times'][0] <= currentTime) {
      time = item['times'][0]
      item['times'].shift()
    }
    let eulerData = item['action'][currentTime] || ''
    if (eulerData) {
      emit("modelAction", key, eulerData)
    }
  }
  state.mixStep = state.mixStep < state.currentStep ? state.currentStep : state.mixStep
}
setInterval(animation, .1);

function animation() {
  if (!state.bool) return;
  //前时间减去上次开启时间减去暂停累计时间
  var times = new Date().getTime() - state.time - state.pauseTime;
  var minutes = Math.floor(times / 60000);//毫秒转化为分钟
  var seconds = Math.floor((times - minutes * 60000) / 1000);//已知分钟
  state.currentTime = times
  setAc()
  if (state.currentTime >= state.duration) {
    clickHandler('')
    clickHandler('action')
  }
  // 将time减去分钟 除去1000得出 秒
  var ms = Math.floor((times - minutes * 60000 - seconds * 1000) / 10);//
  state.showTime =
      (minutes < 10 ? "0" + minutes : minutes) + ":"
      + (seconds < 10 ? "0" + seconds : seconds) + ":"
      + (ms < 10 ? "0" + ms : ms);
}

//点击时的事件
function clickHandler(startBn) {
  state.actionsClone = cloneDeep(state.actions)
  let _startBn = startBn || ''
  state.bool = !state.bool;
  if (_startBn) {
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