// src/views/test/animate.ts
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as RAPIER from '@dimforge/rapier3d';
import {modelData} from "@/views/test/rapier3d/modelData.ts";

export function animate(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  world: RAPIER.World,
  cube: THREE.Mesh,
  sphere: THREE.Mesh,
  parentObject: THREE.Mesh,
  rigidBody: RAPIER.RigidBody,
  controls: OrbitControls
) {
  // 一分钟60次
  requestAnimationFrame(() => animate(renderer, scene, camera, world, cube,sphere,parentObject, rigidBody, controls));
  // 更新物理世界
  world.step();
// 获取刚体的最新位置和旋转
  const position = rigidBody.translation();
  const rotation = rigidBody.rotation();
// 同步立方体位置（考虑相对位置偏移）
  parentObject.position.set(
      position.x ,                    // x 轴偏移
      position.y , // y 轴偏移（立方体中心位置）
      position.z                      // z 轴偏移
  );
// 同步旋转
  parentObject.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);

  // 更新渲染和控制
  controls.update();
  renderer.render(scene, camera);
}
