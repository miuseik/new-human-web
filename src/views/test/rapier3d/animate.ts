// src/views/test/animate.ts
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function animate(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  world: RAPIER.World,
  cube: THREE.Mesh,
  rigidBody: RAPIER.RigidBody,
  controls: OrbitControls
) {
  requestAnimationFrame(() => animate(renderer, scene, camera, world, cube, rigidBody, controls));

  // 更新物理世界
  world.step();

  // 获取刚体位置
  const position = rigidBody.translation();
  cube.position.set(position.x, position.y, position.z);

  // 获取刚体旋转
  const rotation = rigidBody.rotation();
  cube.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);

  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  // 更新 OrbitControls
  controls.update();

  // 渲染场景
  renderer.render(scene, camera);
}
