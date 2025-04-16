// src/views/test/physicsSetup.ts
import * as RAPIER from '@dimforge/rapier3d';

export function initPhysics() {
  // 创建物理世界（修正重力值）
  const gravity = { x: 0.0, y: -10, z: 0.0 };
  const world = new RAPIER.World(gravity);

  // 创建地面
  const groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0)
      .setRestitution(1);
  world.createCollider(groundColliderDesc);

  // 创建动态刚体
  const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0.0, 1.0, 0.0);
  const rigidBody = world.createRigidBody(rigidBodyDesc);

  // 创建立方体碰撞器（选择一种形状！）
  // const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5) // 立方体形状
  //     .setRestitution(1)
  //     .setRestitutionCombineRule(RAPIER.CoefficientCombineRule.Min);
  const colliderDesc = RAPIER.ColliderDesc.ball(0.5) // 球体形状
      .setRestitution(0.7)
      .setRestitutionCombineRule(RAPIER.CoefficientCombineRule.Min);

  // 关联到刚体
  world.createCollider(colliderDesc, rigidBody);

  return { world, rigidBody };
}
