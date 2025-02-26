<!--// 路径：src/views/home/components/Robot3d/index.vue-->
<template>
  <div class="three-box">
    <!--    左侧主控模块-->
    <Menu
        @sliderInput="modelAction"
        @switchChange="switchChange"
        @updateBoneList="updateBoneList"/>
    <!--    开始-->
    <action @modelAction="modelAction" ></action>
    <div class="dot-warp">
      <!--      特殊接头-->
      <p style="width: auto; text-align: center;margin-top: 20px">特殊关节</p>
      <template v-for="item in state.specialJoints">
        <div class="dot-box flex-row-center-center">
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
    <div class="canvas-parent-node">
      <canvas class="webgl" ref="webgl" id="three_id"></canvas>
    </div>
  </div>
</template>
<script lang="ts" setup>
const emit = defineEmits(["sliderInput", "switchChange", "modelAction"]);
import boneThreeView from "./index.js";
import Menu from "./Menu/index.vue";
import action from "./action/index.vue";
import bus from "@/utils/Bus";

let base = null;
import boneStore from '@/store/bone/index.ts';

const bone = boneStore()
const state = reactive({
  dot: null,
  dotArr: {},
  JointArray: bone.JointArray || {},
  specialJoints: [
    'mixamorigHips', 'D3', 'D4', 'D5'
  ],
  actions: {}
})
watch(() => bone.JointArray, val => {
  state.JointArray = val
}, {
  deep: true,
  immediate: true
})
/**
 *
 * 计算
 * @param range 计算
 */
const calculate = (range) => {
  const round = (x) => {
    return Math.round(x * 10000) / 100
    // return Number(x.toFixed(2));
  }
  let dataFloat = {
    min: {
      a: round(range['min']),
      b: 1,
      c: 100,
    },
    max: {
      a: round(range['max']),
      b: 1,
      c: 600,
    },
  }
  let res = {
    x: 0,
    y: 0
  }
  var a = parseFloat(dataFloat['min']['a'].toString());
  var b = parseFloat(dataFloat['min']['b'].toString());
  var c = parseFloat(dataFloat['max']['a'].toString());
  var d = parseFloat(dataFloat['max']['b'].toString());
  var p = parseFloat(dataFloat['min']['c'].toString());
  var q = parseFloat(dataFloat['max']['c'].toString());
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
/**
 * 操作轨迹球,监控舵机旋转
 * @param name
 * @param euler
 * @param options
 */
const setDot = (name, euler, options) => {
  // 操作轨迹球,监控舵机旋转
  const getServer = (val, res) => {
    let old_val = val || 0
    // let new_val =
    return parseInt(old_val * res['x'] + res['y'])
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
    state.dotArr[`${name}_x`].style.top = `${(x - 100) / 5}px`
    state.dotArr[name].style.top = `${(z - 100) / 5}px`
    state.dotArr[name].style.left = `${(y - 100) / 5}px`
  }
  return thetaData
}
/**
 * 移动option进度条触发
 * @param id
 * @param option {x: 0, y: 0, z: 0}
 */
const modelAction = (id, option) => {
  bus.emit("baseSliderInput", option) //主进程通信,控制硬件
  let action = { //现在看是一样的,但是后续还要做处理,这样写没错的
    x: {
      coordinate: option['_x'] || option['x'],
      euler: option['_x'] || option['x'],
    },
    y: {
      coordinate: option['_y'] || option['y'],
      euler: option['_y'] || option['y'],
    },
    z: {
      coordinate: option['_z'] || option['z'],
      euler: option['_z'] || option['z'],
    },
  }
  let _options = state.JointArray[id]['info']['option']
  let field = state.JointArray[id]['info']['field']
  let dot_action = setDot(field, action, _options)
  // return
  action.x.coordinate = dot_action.x
  action.y.coordinate = dot_action.y
  action.z.coordinate = dot_action.z
  //设置特殊关节的位置视图
  state.actions[id] = dot_action
  for (let key in action) {
    let item = action[key]
    //传给舵机的值
    driveServer(item['coordinate'], id, key, _options)
    //传给threejs的值
    driveModel(item['euler'], id, key, _options)
  }
};
const driveServer = (e, name, direction, options) => {
  let option = options[direction]
  let server_val = e
  if (direction === 'x') {
  }
  server_val = option.server_reverse ? 700 - server_val : server_val
  emit("sliderInput", server_val, name, direction);
}
const driveModel = (e, name, direction, options) => {
  let option = options[direction]
  let model_val = option.model_reverse ? e * -1 : e
  base.setRobotRotation(model_val, name, direction);
}

const switchChange = (enabled) => {
  base.setControlsEnabled(enabled);
};
// 更新模型列表
const updateBoneList = () => {
  base.initRobot();
};

onMounted(() => {
  let dom = document.getElementById("three_id");
  base = new boneThreeView(dom);
  setTimeout(() => {
    for (let item in state.specialJoints) {
      let key = state.specialJoints[item]
      state.dotArr[key] = document.querySelector(`#dot_${key}`)
      state.dotArr[`${key}_x`] = document.querySelector(`#dot_${key}_x`)
    }
  }, 500)
})
// defineExpose({ setRobotRotation, setControlsEnabled });
</script>

<style lang="scss" scoped>
.three-box {
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100%;
  position: relative;

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
  }

  .canvas-parent-node {
    overflow: hidden;
    height: 100vh;
    min-width: 500px;
    width: 100%;
  }
}
</style>
