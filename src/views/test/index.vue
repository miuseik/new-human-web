<template>
  <div class="test" ref="canvas" id="my_three"></div>
</template>
<script setup lang='ts'>
import * as THREE from "three";
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";


const getQuater = (x, y, z) => {
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z));
}

let q1 = getQuater(0, 0, -Math.PI / 4)
let q2 = getQuater(0, 0, Math.PI / 3)
let q3 = getQuater(0, 0, -Math.PI / 2)
let q4 = getQuater(0, 0, 0)
let q5 = getQuater(0, 0, Math.PI / 4)
let q6 = getQuater(0, 0, Math.PI / 3)
let q7 = getQuater(0, Math.PI / 4, Math.PI / 12)
let q8 = getQuater(0, 0, -Math.PI / 6)
let q9 = getQuater(0, -Math.PI / 4, Math.PI / 12)
let q10 = getQuater(0, Math.PI / 12, 0)
let q11 = getQuater(0, -Math.PI / 12, 0)
console.log('q1', q1)
console.log('q2', q2)
console.log('q3', q3)
console.log('q4', q4)
console.log('q5', q5)
console.log('q6', q6)
console.log('q7', q7)
console.log('q8', q8)
console.log('q9', q9)
console.log('q10', q10)
console.log('q11', q11)

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
const loader = new FBXLoader()
// loader.load('/Strut Walking.fbx', mesh => {
// loader.load('/AnimatedCharacter_lod00.fbx', mesh => {
loader.load('/Catwalk Walk Forward Turn 90R.fbx', mesh => {
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
