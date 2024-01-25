<script setup lang="ts">
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';

import {onMounted} from 'vue'
import {reactive} from "vue";

const lookAt = {x: 2, y: 100, z: 2}
const state = reactive({
  threeWidth : 100,
  threeHeight: 100,
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
const initModel = () => {
  const loader = new FBXLoader();
  loader.load('Walking.fbx', function (object) {
    mixer = new THREE.AnimationMixer(object);
    console.log('mixer--',mixer)
    const action = mixer.clipAction(object.animations[0]);
    action.play();
    // object.traverse(function (child) {
    //   if (child.isMesh) {
    //     child.castShadow = true;
    //     child.receiveShadow = true;
    //   }
    // });
    scene.add(object);
  });
}
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  // console.log('delta==',delta)
  if (mixer) mixer.update(delta);
  renderer.render(scene, camera);
}

const initCamera = () => {
  camera = new THREE.PerspectiveCamera(40, state.threeWidth / state.threeHeight, 0.25, 5000);
  camera.position.set(160, 120, 540);
  scene.add(camera)
  // camera.lookAt(lookAt.x, lookAt.y, lookAt.z)
};
const initHelp = () => {
  const axesHelper = new THREE.AxesHelper(200);//参数200标示坐标系大小，可以根据场景大小去设置
  // scene.add(axesHelper);
  // ground
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({color: 0x000000, depthWrite: false}));
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
  initWindowSizes()
  initScene()
  initLight()
  initModel()
  initCamera()
  initHelp()
  render()
  initControls()
}

onMounted(() => {
  init()
  animate()
})
</script>

<template>
  <div class="action-library">
    <div class="action-option">
      <div class="my-button-common">显示动作</div>
    </div>
    <div class="action-border my-card-warp">
      <div id="my-three" class="action-body">
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.action-option {

}

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