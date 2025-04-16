<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as RAPIER from '@dimforge/rapier3d';
import {
  createScene,
  createCamera,
  createRenderer,
  createGradientTexture,
  createGround,
  createCube,
  createSphere,
  createControls,
} from './rapier3d/threeSetup.ts';
import { initPhysics } from './rapier3d/physicsSetup.ts';
import { animate } from './rapier3d/animate.ts';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const container = ref<HTMLElement | null>(null);

let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let world: RAPIER.World | null = null;
let rigidBody: RAPIER.RigidBody | null = null;
let cube: THREE.Mesh | null = null;
let controls: OrbitControls | null = null;

onMounted(() => {
  if (!container.value) {
    console.error('Container element not found');
    return;
  }

  // 初始化 Three.js 场景
  scene = createScene();
  camera = createCamera();
  renderer = createRenderer(container.value);

  // 创建天空背景
  const skyGradient = createGradientTexture();
  scene.background = skyGradient;

  // 创建地面
  const ground = createGround();
  scene.add(ground);

  // 创建立方体
  // cube = createCube();
  cube = createSphere(0.6);
  scene.add(cube);

  // 设置相机位置
  camera.position.z = 5;

  // 初始化物理引擎
  const physics = initPhysics();
  world = physics.world;
  rigidBody = physics.rigidBody;

  // 创建 OrbitControls
  controls = createControls(camera!, renderer!);

  // 渲染循环
  animate(renderer!, scene!, camera!, world!, cube!, rigidBody!, controls!);


});
</script>

<template>
  <div ref="container" class="sim-container"></div>
</template>

<style scoped>
.sim-container {
  width: 100vw;
  height: 100vh;
  position: relative;
}
</style>
