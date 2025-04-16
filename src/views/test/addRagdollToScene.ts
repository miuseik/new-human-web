// src/views/test/addRagdollToScene.ts
import * as THREE from 'three';
import * as RAPIER from '@dimforge/rapier3d';
import { createRagdoll } from './rapier3d/createRagdoll.ts';

export function addRagdollToScene(
  scene: THREE.Scene,
  world: RAPIER.World,
  scale: number,
  angleA = 0,
  angleB = 0,
  twistAngle = 0
) {
  const ragdoll = createRagdoll(scale, angleA, angleB, twistAngle);
  const shapes = ragdoll.shapes;
  const joints = ragdoll.joints;

  const threeShapes: { [key: string]: THREE.Mesh } = {};
  const rapierBodies: { [key: string]: RAPIER.RigidBody } = {};

  // 添加形状到 three.js 场景和 rapier3d 物理世界
  for (const [key, shape] of Object.entries(shapes)) {
    let geometry: THREE.BufferGeometry;
    let colliderDesc: RAPIER.ColliderDesc;

    if (shape.args.length === 3) {
      geometry = new THREE.BoxGeometry(...shape.args);
      colliderDesc = RAPIER.ColliderDesc.cuboid(shape.args[0] / 2, shape.args[1] / 2, shape.args[2] / 2);
    } else if (shape.args.length === 1) {
      geometry = new THREE.SphereGeometry(shape.args[0]);
      colliderDesc = RAPIER.ColliderDesc.ball(shape.args[0]);
    } else {
      throw new Error('Unsupported geometry type');
    }

    const material = new THREE.MeshBasicMaterial({ color: shape.color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...shape.position);
    scene.add(mesh);

    const bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(...shape.position);
    const body = world.createRigidBody(bodyDesc);

    world.createCollider(colliderDesc, body);

    threeShapes[key] = mesh;
    rapierBodies[key] = body;
  }

  // 添加关节到 rapier3d 物理世界
  for (const [key, joint] of Object.entries(joints)) {
    const bodyA = rapierBodies[joint.bodyA];
    const bodyB = rapierBodies[joint.bodyB];

    if (!bodyA || !bodyB) {
      console.error(`Joint ${key} references non-existent bodies: ${joint.bodyA}, ${joint.bodyB}`);
      continue;
    }

    const pivotA = new RAPIER.Vector3(...joint.pivotA);
    const pivotB = new RAPIER.Vector3(...joint.pivotB);
    const axisA = new RAPIER.Vector3(...joint.axisA);
    const axisB = new RAPIER.Vector3(...joint.axisB);

    const jointDesc = RAPIER.JointData.revolute(pivotA, axisA, pivotB, axisB);
    world.createImpulseJoint(jointDesc, bodyA.handle, bodyB.handle);
  }

  return { threeShapes, rapierBodies };
}
