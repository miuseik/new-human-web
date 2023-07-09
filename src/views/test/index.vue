<template>
  <div class="test" ref="canvas" id="my_three">
    <div class="flex">x<input type="text" v-model="state.x" @input="setDeta"></div>
    <div class="flex">y<input type="text" v-model="state.y" @input="setDeta"></div>
    <div class="flex">z<input type="text" v-model="state.z" @input="setDeta"></div>
    <div>
      <p>{{ state.coordinate.x || '--' }}</p>
      <p>{{ state.coordinate.y || '--' }}</p>
      <p>{{ state.coordinate.z || '--' }}</p>
    </div>

    <button class="btn btn-brand" @click="translate">
      translate
    </button>
  </div>
</template>
<script setup lang='ts'>

const state = reactive({
  animateBones: false,
  mesh:null,
  model:[
    'Martelo 2.fbx',
    // 'Brutal Assassination.fbx',
    // 'Strut Walking.fbx'
  ],
  x         : 0,
  y         : 0,
  z         : 0,
  coordinate: {
    x: '',
    y: '',
    z: '',
  }
})
let a           = 3 / (Math.PI / 2)
const getServer = (val) => {
  let old_val = val || 0
  let new_val = parseInt(old_val * a + 300)
  return new_val
}
const hd = (jd) => {
  let _jd = Math.PI / 180 * jd;
  return jd
  // return _jd
}
const jd = (hd) => {
  return 180 / Math.PI * hd;
}
const setDeta = () => {
  console.log('----', state.x, state.y, state.z)
  let alpha = state.x
  let beta = state.y
  let gamma = state.z
  let x = hd(alpha)
  let y = hd(beta)
  let z = hd(gamma)
  let new_x = Math.cos(hd(y)) * Math.cos(hd(z))
  let new_y = Math.sin(hd(y)) * Math.cos(hd(z))
  let new_z = Math.sin(hd(z))
  let ser_x = getServer(new_x*100)
  let ser_y = getServer(new_y*100)
  let ser_z = getServer(new_z*100)
  console.log('x--',  jd(new_x))
  console.log('y--',  jd(new_y))
  console.log('z--',  jd(new_z))
  console.log('ser_x--',  jd(ser_x))
  console.log('ser_y--',  jd(ser_y))
  console.log('ser_z--',  jd(ser_z))
  state.coordinate.x = new_x
  state.coordinate.y = new_y
  state.coordinate.z = new_z

}
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import * as THREE from "three";
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import {STLLoader} from 'three/addons/loaders/STLLoader.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';

const fbx_loader = new FBXLoader()
const stl_loader = new STLLoader()
const gltf_loader = new GLTFLoader()
const draco_Loader = new DRACOLoader();

let mixer = null
let actions = []
const OOI = {};


let gui, camera, renderer, cameraTarget,controls, sizes, orbit, lights, mesh, bones, skeletonHelper;
let scene = new THREE.Scene();
let clock = new THREE.Clock();

function initWindowSizes() {
  sizes = {
    width : window.innerWidth,
    height: window.innerHeight,
  };

  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();


  });
}

function initScene() {
  scene.background = new THREE.Color(0x72645b);
  scene.fog = new THREE.Fog(0x72645b, 2, 10000);
  const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(40000, 40000),
      new THREE.MeshPhongMaterial({
        color   : 0xcbcbcb,
        specular: 0x474747
      })
  );
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = 0;
  plane.receiveShadow = true;
  scene.add(plane);
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000);
  camera.position.set(1500, 1500, 1500);
  scene.add(camera);

  cameraTarget = new THREE.Vector3( 0, - 0.8, 0 );

}
function addShadowedLight( x, y, z, color, intensity ) {

  const directionalLight = new THREE.DirectionalLight( color, intensity );
  directionalLight.position.set( x, y, z );

  directionalLight.castShadow = true;

  const d = 1;
  directionalLight.shadow.camera.left = - d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = - d;

  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 4;

  directionalLight.shadow.bias = - 0.002;
  scene.add( directionalLight );

}
function inLights() {
  scene.add( new THREE.HemisphereLight( 0x8d7c7c, 0x494966, 3 ) );
  addShadowedLight( 1000, 1000, 1000, 0xffffff, 3.5 );
  addShadowedLight( 0.5000, 1000, - 1000, 0xffd500, 3 );
}

function initHelper() {
  const axes = new THREE.AxesHelper(2000);
  scene.add(axes);
  // const gridHelper = new THREE.GridHelper(50000, 100);
  // scene.add(gridHelper);
}

function initControls() {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.75, 0);
  controls.enableDamping = true;
}

function setControlsEnabled(enabled) {
  controls.enabled = enabled
}

const render = () => {
  if (mixer) {
    mixer.update(clock.getDelta())
  }


  camera.lookAt( cameraTarget );
  renderer.render(scene, camera)
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.useLegacyLights = false;
  renderer.shadowMap.enabled = true;

  document.body.appendChild(renderer.domElement);
  // render()
  renderer.setAnimationLoop(render)
}

function setupDatGui() {


}

var material = new THREE.MeshLambertMaterial({
  color: 0x0000ff
}); //材质对象Material
const translate = () => {
  var axis = new THREE.Vector3(.1,1,0);
  axis.normalize(); // 归一化该向量。将这个向量转换成一个单位向量，也就是除以它的长度。
  state.mesh.translateOnAxis(axis,100);// 沿着axis轴表示的方向平移100
  console.log(state.mesh.position)
}

async function initModel() {
  const geometry = new THREE.BoxGeometry(100, 100, 100); //创建一个立方体几何对象Geometry///这是生成几何体的方法，主要是根据顶点生成对应的skinIndex和skinWeight属性

  var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
  state.mesh = mesh
  scene.add(mesh); //网格模型添加到场景中
}
function init() {
  initWindowSizes()
  initCamera()
  initScene()
  inLights()
  initHelper()
  initRenderer()
  initControls()
  initModel();
  setupDatGui();
}
init()
setDeta()
</script>
<style lang="scss" scoped>
.test {
  //width: 100vw;
  //height: 100vh;
}
canvas {
  display: block;
  width: 100%;
  height: 100%;
}

#newWindow {
  display: block;
  position: absolute;
  bottom: 0.3em;
  left: 0.5em;
  color: #fff;
}
</style>
