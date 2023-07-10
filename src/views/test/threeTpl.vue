<template>

</template>
<script setup lang='ts'>
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
const state = {
  animateBones: false,
  model:[
      'Martelo 2.fbx',
      // 'Brutal Assassination.fbx',
      // 'Catwalk Walk Forward Turn 90R.fbx',
      // 'Strut Walking.fbx'
      // 'Standing Jump.fbx'
  ]
};

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

const material = new THREE.MeshPhongMaterial({
  color    : 0xff9c7c,
  specular : 0x494949,
  shininess: 200
});
const loadingModel       = () => {
  return new Promise(((resolve, reject) => {
    stl_loader.load(`/src/assets/human/HumanSkeleton2022.STL`, (geometry) => {
      let mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      // Mesh.scale.set(_scale.x, _scale.y, _scale.z);
      resolve(mesh)
    });
  }))
}
const createGeometry = async () => {
  let geometry = await loadingModel
  console.log(geometry)
  return geometry
}
const loadFbx = () => {
  return new Promise(((resolve, reject) => {
    state.model.forEach((item, index) => {
      fbx_loader.load(item, mesh => {
        scene.add(mesh)
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mixer = new THREE.AnimationMixer(mesh)
        for (let i = 0; i < mesh.animations.length; i++) {
          // actions[index] = []
          // actions[index].push(mixer.clipAction(mesh.animations[i]))
          actions.push(mixer.clipAction(mesh.animations[i]))
          // console.log(mesh.animations[i])
        }
        resolve(actions)
        actions[0].play()
        console.log('loadFbx', actions)
        // actions[index][0].play()
      })
    })
  }))
}
async function initModel() {

  const geometry = await createGeometry; ///这是生成几何体的方法，主要是根据顶点生成对应的skinIndex和skinWeight属性
  let actions = await loadFbx()
  console.log(actions)
  // actions[0].play()
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


</script>
<style lang="scss" scoped>
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
