<template>
  <div class="action-library">
    <div class="action-option">
      <div class="my-button-common" @click="showAction = !showAction">{{ showAction ? '隐藏' : '显示' }}动作</div>
    </div>
    <div class="action-border my-card-warp" v-show="showAction">
      <div id="my-three" class="action-body">
      </div>
    </div>
    <div class="flex-row-center-between" v-if="showAction">
      <div class="login_short_btn" :class="currentActionIndex === 0 ? 'login_short_btn_disabled':''"
           @click="prevAction"><
      </div>
      <div class="login_short_btn"
           :class="currentActionIndex === actionPaths.length - 1 ? 'login_short_btn_disabled':''" @click="nextAction">>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import modelViewData from '@/views/modelView/data/index.js'

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';
import {onMounted, reactive, ref} from 'vue'
import boneStore from '@/store/bone/index.ts';
import dataIndex from "@/views/modelView/components/newHuman/data";

const bone = boneStore()
const showAction = ref(true)
const animateAction = ref([])

const currentActionIndex = ref(0)
const actionPaths = [
  '/model/Walking.fbx',
  '/model/AnimatedCharacter_lod00.fbx',
  '/model/Brutal Assassination.fbx',
  '/model/Catwalk Walk Forward Turn 90R.fbx',
  '/model/Flair.fbx',
  '/model/Martelo 2.fbx',
  '/model/Soldier.glb',
  '/model/Standing Jump.fbx',
  '/model/Strut Walking.fbx',
] // 替换为实际的动作文件路径

const lookAt = {x: 2, y: 100, z: 2}
const state = reactive({
  threeWidth: 100,
  threeHeight: 100,
  mixStep: 0, //
  duration: 5000, // 持续时间
})
let threeDom, scene, camera, renderer, clock, mixer
const initWindowSizes = () => {
  threeDom = document.getElementById('my-three')
  clock = new THREE.Clock();
  state.threeWidth = threeDom.clientWidth
  state.threeHeight = threeDom.clientHeight
}
const initScene = () => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x073149);
  scene.fog = new THREE.Fog(0x073149, 0, 1500);
}
const initLight = () => {
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 5);
  hemiLight.position.set(0, 200, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 5);
  dirLight.position.set(0, 200, 100);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 180;
  dirLight.shadow.camera.bottom = -100;
  dirLight.shadow.camera.left = -120;
  dirLight.shadow.camera.right = 120;
  scene.add(dirLight);
}

const setRange = (val, key) => {
  if (Math.abs(val) > Math.PI) {
    return val - (2 * Math.PI)
  }
  return val
}
/**
 * 四元数转三维向量,计算欧拉角
 * @param track {values, times}
 * @param len
 * @param key
 */
let chunkArray = (track, len, key) => {
  const { values, times } = track;
  const result = {};
  const chunkCount = Math.ceil(values.length / len);
  for (let i = 0; i < chunkCount; i++) {
    let data = values.slice(i * len, i * len + len);
    let x = data[0];
    let y = data[1];
    let z = data[2];
    let w = data[3];

    let quaternion = new THREE.Quaternion(x, y, z, w);
    let Euler = new THREE.Euler();
    let eulerData = Euler.setFromQuaternion(quaternion);

    if (key === 'mixamorigRightUpLeg' || key === 'mixamorigLeftUpLeg') {
      eulerData['_z'] = eulerData['_z'] + Math.PI;
    } else if (key === 'mixamorigRightLeg' || key === 'mixamorigLeftLeg') {
      eulerData['_x'] = eulerData['_x'] - Math.PI / 2;
    } else {
      eulerData['_x'] = eulerData['_x'] - Math.PI / 4;
    }

    eulerData['_x'] = setRange(eulerData['_x'], '_x');
    eulerData['_y'] = setRange(eulerData['_y'], '_y');
    eulerData['_z'] = setRange(eulerData['_z'], '_z');

    result[times[i]] = eulerData;
  }
  return result;
};

/*
 * 动作初始化模型
 */
const getModel = async () => {
  const loader = new FBXLoader();
  const currentPath = actionPaths[currentActionIndex.value]
  return new Promise(((resolve, reject) => {
    loader.load(currentPath, function (mesh) {
      resolve(mesh)
      //
      // state.mixStep = 0
      // let tracks = mesh.animations[0]['tracks']
      // let duration = mesh.animations[0]['duration'] * 1000 //持续时间
      // state.duration = duration
      // resolve(mesh)
    })
  }))
}
const initModel = async () => {
  // D1: {
  //   times: [],
  //       values: {},
  //   action: {},
  //   key: 1,
  //       direction: {
  //     "x": true,
  //         "y": true,
  //         "z": true,
  //   },
  //   index: 0
  // },
  // D2: {
  //   times: [],
  //       values: {},
  //   action: {},
  //   key: 45,
  //       direction: {
  //     "x": true,
  //         "y": true,
  //         "z": true,
  //   },
  //   index: 0
  // },
  if (bone.getBoneList.length > 0) {
    let object = await getModel()
    const _animateAction = {};
    const tracks = object.animations[0].tracks;
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      const field = track.name.split('.')[0];
      const motionType = track.name.includes('.position') ? '移动' : '旋转';
      const jointNameChinese = modelViewData.boneName[field];

      // 检查 _animateAction[field] 是否存在，如果不存在则初始化
      if (!_animateAction[field]) {
        _animateAction[field] = {
          jointNameEnglish: field,
          jointNameChinese: jointNameChinese,
          name: track.name,
          times: track.times,
          motionType: motionType,
          values: track.values,
          position: null,
          rotate: null
        };
      }

      let item = _animateAction[field];
      // 根据运动类型更新 position 或 rotate
      if (motionType === '移动') {
        item.position = chunkArray(track, 3, field);
      } else {
        item.rotate = chunkArray(track, 4, field);
      }

      _animateAction[field] = item;
    }
    animateAction.value=[]
    bone.getBoneList.forEach((item) => {
      _animateAction[item.field]? animateAction.value.push(_animateAction[item.field]) : ''
    })
    bone.addAnimateAction(animateAction.value);
  }
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  renderer.render(scene, camera);
}

const initCamera = () => {
  camera = new THREE.PerspectiveCamera(40, state.threeWidth / state.threeHeight, 0.25, 5000);
  camera.position.set(160, 120, 540);
  scene.add(camera)
};
const initHelp = () => {
  const axesHelper = new THREE.AxesHelper(200);//参数200标示坐标系大小，可以根据场景大小去设置
  scene.add(axesHelper);
  // ground
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({
    color: 0x000000,
    depthWrite: false
  }));
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);
  const grid = new THREE.GridHelper(2000, 40);
  grid.material['opacity'] = 0.2;
  grid.material['transparent'] = true;
  scene.add(grid);
}
const initControls = () => {
  const controls = new OrbitControls(camera, renderer.domElement)//创建控件对象
  controls.target.set(lookAt.x, lookAt.y, lookAt.z);
  camera.lookAt(lookAt.x, lookAt.y, lookAt.z)
  renderer.render(scene, camera)//监听鼠标，键盘事件
  controls.addEventListener('change', () => {
    renderer.render(scene, camera)//监听鼠标，键盘事件
  })
  threeDom?.appendChild(renderer.domElement)
}
const render = () => {
  renderer = new THREE.WebGLRenderer({
    antialias: true, //开启锯齿
    alpha: true,
  });
  renderer.setSize(state.threeWidth, state.threeHeight)//设置渲染区尺寸
  renderer.useLegacyLights = false;
  renderer.shadowMap.enabled = true;
}
const init = () => {
  initWindowSizes() // 初始化窗口大小
  initScene()       // 初始化场景
  initLight()       // 初始化灯光
  initModel()       // 初始化模型
  initCamera()      // 初始化相机
  initHelp()        // 初始化帮助信息
  render()          // 渲染场景
  initControls()    // 初始化控件
}

const prevAction = () => {
  if (currentActionIndex.value > 0) {
    currentActionIndex.value--
    initModel()
  }
}

const nextAction = () => {
  if (currentActionIndex.value < actionPaths.length - 1) {
    currentActionIndex.value++
    initModel()
  }
}
watch(() => bone.getBoneList, val => {
  initModel()
}, {
  deep: true,
  immediate: false
})
onMounted(() => {
  init()
  animate()
})
</script>

<style scoped lang="scss">
.action-border {
  width: 300px;
  height: 300px;
  padding: 10px;

  .action-body {
    width: 100%;
    height: 100%;
  }
}
</style>