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
      <!--      <input class="input-time" type="text" v-model="state.duration">-->
      <!--      <button class="btn btn-brand">时长</button>-->
    </div>
  </div>
</template>
<!--@click="click"     鼠标点击-->

<!--@mousedown="down"       按下鼠标-->
<!--@mouseup="up"          松开鼠标-->

<!--@dblclick="dblclick"      双击-->


<!--@mousemove="move"     鼠标移动-->


<!--@mouseleave="out"        鼠标离开-->
<!--@mouseout ="out"         鼠标移出-->

<!--@mouseenter="enter"     鼠标进入-->

<!--@mouseover="enter"        鼠标在-->
<script lang="ts" setup>
import Three from "@/views/test/three.vue";
import * as THREE from "three";
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'

const fbx_loader = new FBXLoader()
const emit = defineEmits(["sliderInput", "switchChange", "updateBoresList"]);
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
  currentStep : 1,
  isMouseDown : false,
  isStart     : false,
  logAction   : [],
  duration       : 5000,
  actions     : {
    D1: {
      times    : {},
      values   : {},
      key      : 1,
      direction: {
        "x": true,
        "y": true,
        "z": true,
      },
      index    : 0
    },
    D2: {
      times    : {},
      values   : {},
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
    item.index=0
  }
}


let chunkArray = (arr, len) => {
  let chunks = Array.from({length: Math.ceil(arr.length / len)}, function (_, i) {
    let data = arr.slice(i * len, i * len + len)
    let tcb = {
      isQuaternion: true,
      "_x"        : data[0],
      "_y"        : data[1],
      "_z"        : data[2],
      "_w"        : data[3]
    }
    let Euler = new THREE.Euler();
    let newEuler = Euler.setFromQuaternion(tcb)
    return newEuler;
  });
  state.values = chunks
  return chunks;
}

const initModel = async () => {
  return new Promise(((resolve, reject) => {
    fbx_loader.load('/Martelo 2.fbx', mesh => {
    // fbx_loader.load('/Standing Jump.fbx', mesh => {
    // fbx_loader.load('/Flair.fbx', mesh => {
    // fbx_loader.load('/Catwalk Walk Forward Turn 90R.fbx', mesh => {
    // fbx_loader.load('/Strut Walking.fbx', mesh => {
      let action = mesh.animations[0]['tracks']
      let duration = mesh.animations[0]['duration'] * 1000
      state.duration = parseInt(duration)
      console.log(duration)
      console.log(state.duration )
      resolve(action)
    })
  }))
}

const init = async () => {
  console.log(';state.actions', state.actions)
  let action = await initModel()
  for (let key in state.actions) {
    let item = state.actions[key]
    item.times = action[item['key']]['times']
    let val = action[item['key']]['values']
    item.values = chunkArray(val, 4)
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
const checkStep = (item) => {
  if (!state.isMouseDown) return
  state.currentStep = item
}
let timer
const start = () => {
  state.isStart = true
  let num = state.currentStep || 1;
  let tim = 0
  timer = setInterval(() => {
    num++;
    var time = tim.toFixed(3)
    for (let key in state.actions) {
      let item = state.actions[key]
      let index =  item.times[item.index] || 0
      let timNums =   index.toFixed(3)
      if (time === timNums) {
        for (let direction in item.direction) {
          if (item.direction[direction]) {
            let value = item.values[item.index][`_${direction}`] || ''
            let action = key+direction
            if (action === 'D2z' || action === 'D6z' ){
              // console.log(value)
              value =  value + (Math.PI)
            }
            emit("sliderInput", value, key, direction);
          }
        }
        item.index++
      }
    }
    tim += 0.001
    state.currentStep = num
    if (num >= state.duration) {
      reset()
      clearInterval(timer);
      start()
    }
  }, 2);
}
const stop = () => {
  state.isStart = false
  clearInterval(timer);
}
const reset = () => {
  resetAction()
  console.log(state.actions)
  state.isStart = false
  state.currentStep = 1
  clearInterval(timer);
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

</style>