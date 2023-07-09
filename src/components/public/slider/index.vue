<template>
  <div class="range">
    <div class="range-box">
      <template v-for="(item, index) in state.duration*1">
        <div class="range-item" @mouseover="checkStep(item)" @mousedown="mousedown(item)" @mouseup="mouseup(item)">
          <div class="dot current-step none-select" v-if="state.currentStep === item">
            <i class="none-select">{{ item }}</i>
          </div>
          <div class="grid none-select" :class="index%10 === 0 ? 'grid-10' : index%5 === 0 ? 'grid-5' : ''"></div>
          <!--          <div >{{item}}</div>-->
        </div>
      </template>
    </div>
    <div class="option none-select">
      <div class="btn btn-brand" @click="start" v-if="!state.isStart">开始</div>
      <div class="btn btn-brand" @click="stop" v-else>停止</div>
      <div class="btn btn-brand" @click="reset">复位</div>
    </div>
    <div class="demo">
      <div class="inner">
        <div class="dot" id="dot">
        </div>
        <div class="dot dot-mark">
        </div>
      </div>
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
  currentStep: 0,
  mixStep    : 0,
  isMouseDown: false,
  isStart    : false,
  isStartDemo    : false,
  logAction  : [],
  duration   : 5000,
  quaternion : [],
  dot : null,
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
  if(Math.abs(val) > Math.PI){
    console.log('---', key, val)
    return val - (2*Math.PI)
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

    // console.log(eulerData)
    if (key === 'D2' || key === 'D6') {
      eulerData['_z'] = eulerData['_z'] + Math.PI
    }
    eulerData['_x'] = setRange(eulerData['_x'] , '_x')
    eulerData['_y'] = setRange(eulerData['_y'] , '_y')
    eulerData['_z'] = setRange(eulerData['_z'] , '_z')
    if (key === 'D2' ) {
      state.quaternion.push(quaternion)
    }
    return eulerData;
  });
  return chunks;
}

const initModel = async () => {
  return new Promise(((resolve, reject) => {
    // fbx_loader.load('/Martelo 2.fbx', mesh => {
      fbx_loader.load('/Standing Jump.fbx', mesh => {
    //   fbx_loader.load('/Flair.fbx', mesh => {
    // fbx_loader.load('/Catwalk Walk Forward Turn 90R.fbx', mesh => {
    // fbx_loader.load('/Strut Walking.fbx', mesh => {
      state.mixStep = 0
      let action = mesh.animations[0]['tracks']
      let duration = mesh.animations[0]['duration'] * 1000
      console.log(action)
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
  console.log('state.quaternion', state.quaternion)
  console.log(state.actions['D2'])

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
let a           = 3 / (Math.PI / 2)
const jd = (hd) => {
  // 角度= 弧度 * 180 / Math.PI
  return hd * (180 / Math.PI)
}
const hd = (jd) => {
  // 弧度= 角度 * Math.PI / 180
  return jd * (Math.PI / 180)
}

const setDot = (eulerData) => {
  const getServer = (val) => {
    let old_val = val || 0
    let new_val = parseInt(old_val * a + 300)
    return new_val
  }
  let x = eulerData['_x'] || ''
  let y = eulerData['_y'] || ''
  let z = eulerData['_z'] || ''
  // 弧度= 角度 * Math.PI / 180
  // 角度= 弧度 * 180 / Math.PI
  let new_x = x * 100
  let new_y = y * 100
  let new_z = z * 100
  let ser_y = getServer(new_y)
  let ser_z = getServer(new_z)
  console.log('new_x', jd(x))
  console.log('new_y', jd(y))
  console.log('new_z', jd(z))
  state.dot.style.top = `${ser_y/2}px`
  state.dot.style.right = `${ser_z/2}px`
}
const setAction = () => {
  for (let key in state.actions) {
    let item = state.actions[key]
    let time = (state.currentStep / 1000).toFixed(3)
    let eulerData = item['action'][time] || ''
    if (eulerData) {
      if (key === 'D2'){
        setDot(eulerData)
        console.log(eulerData)
      }
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
  }, 1);
}
const stop = () => {
  state.isStart = false
  clearInterval(timer);
}
const reset = () => {
  resetAction()
  state.isStart = false
  state.currentStep = 0
  clearInterval(timer);
}

onMounted(() => {
  state.dot = document.querySelector('#dot')
})
</script>

<style lang="scss" scoped>

.range {
  width: 100%;

  .demo {
    width: 300px;
    height: 300px;
    position: fixed;
    background-color: #060f14;
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
        width: 10px;
        height: 10px;
        position: absolute;
      }
      .dot-mark{
        background-color: red;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
      }
    }

    .dot {

    }
  }

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

</style>