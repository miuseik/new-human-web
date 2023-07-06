<template>
  <div class="test" ref="canvas" id="my_three"></div>
</template>
<script setup lang='ts'>
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import {STLLoader} from 'three/addons/loaders/STLLoader.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';

const fbx_loader = new FBXLoader()
const stl_loader = new STLLoader()
const gltf_loader = new GLTFLoader()
const draco_Loader = new DRACOLoader();

const material = new THREE.MeshPhongMaterial({
  color    : 0xff9c7c,
  specular : 0x494949,
  shininess: 200
});
const loadingModel = () => {
  return new Promise(((resolve, reject) => {
    stl_loader.load(`/src/assets/human/HumanSkeleton2022.STL`, (geometry) => {
      let Mesh = new THREE.Mesh(geometry, material);
      console.log(Mesh)
      resolve(Mesh)
    });
  }))
}

let container;
// const  canvasRef = ref<HTMLCanvasElement|null>(null)
const Scene = new THREE.Scene()

const Camera = new THREE.PerspectiveCamera(50, 2, 0.1, 10000)
Camera.position.z = 500;
const light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 0, 1);
Scene.add(light);

// const controls = new OrbitControls();
// controls.target.set(0, 0.75, 0);
// controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer()

renderer.setClearColor('#ffffff')
renderer.setSize(1000, 500)
onMounted(() => {
  container = document.getElementById("my_three");
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(Camera, container);
  controls.target.set(0, 0.75, 0);
  controls.enableDamping = true;
});
let actions = []
let mixer = null
const OOI = {};

// loader.load('/Strut Walking.fbx', mesh => {
// loader.load('/AnimatedCharacter_lod00.fbx', mesh => {

draco_Loader.setDecoderPath('three/examples/jsm/libs/draco/');
gltf_loader.setDRACOLoader(draco_Loader);
gltf_loader.load( 'src/assets/gltf/HumanSkeleton2022.glb', function ( gltf ) {
  gltf.scene.traverse(n => {
    if (n.name === 'head') OOI['head'] = n;
    if (n.name === 'lowerarm_l') OOI['lowerarm_l'] = n;
    if (n.name === 'Upperarm_l') OOI['Upperarm_l'] = n;
    if (n.name === 'hand_l') OOI['hand_l'] = n;
    if (n.name === 'target_hand_l') OOI['target_hand_l'] = n;
    if (n.name === 'boule') OOI['sphere'] = n;
    if (n.name === 'Kira_Shirt_left') OOI['kira'] = n;
  });
  Scene.add( gltf.scene );
} );
// initModel()
//
// stl_loader.load(`/src/assets/human/HumanSkeleton2022.STL`, (geometry) => {
//   let Mesh = new THREE.Mesh(geometry, material);
//   Scene.add(Mesh)
// });
fbx_loader.load('/Catwalk Walk Forward Turn 90R.fbx', mesh => {
  Scene.add(mesh)
  mixer = new THREE.AnimationMixer(mesh)
  for (let i = 0; i < mesh.animations.length; i++) {
    actions.push(mixer.clipAction(mesh.animations[i]))
    // console.log(mesh.animations[i])
    console.log(mesh.animations[i])
  }
  actions[0].play()
})
let clock = new THREE.Clock
const render = () => {
  if (mixer) {
    mixer.update(clock.getDelta())
  }
  renderer.render(Scene, Camera)
}
renderer.setAnimationLoop(render)

</script>
<style lang="scss" scoped>
.test {
  width: 100vw;
  height: 100vh;
}
</style>
