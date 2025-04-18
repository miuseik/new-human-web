// src/views/test/animate.ts
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as RAPIER from '@dimforge/rapier3d';

export function animate(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  world: RAPIER.World,
  cube: THREE.Mesh,
  sphere: THREE.Mesh,
  rigidBody: RAPIER.RigidBody,
  controls: OrbitControls
) {
  // 一分钟60次
  requestAnimationFrame(() => animate(renderer, scene, camera, world, cube,sphere, rigidBody, controls));

  // 更新物理世界
  world.step();

  // 获取刚体位置
  const position = rigidBody.translation();
  cube.position.set(position.x, position.y, position.z);
  sphere.position.set(position.x, position.y/2, position.z);

  // 获取刚体旋转
  const rotation = rigidBody.rotation();
  cube.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
  sphere.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);

  // 更新 OrbitControls
  controls.update();

  // 渲染场景
  renderer.render(scene, camera);
}
