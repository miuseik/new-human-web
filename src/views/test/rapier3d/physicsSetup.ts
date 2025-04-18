// src/views/test/physicsSetup.ts
import * as RAPIER from '@dimforge/rapier3d';
import {modelData} from "@/views/test/rapier3d/modelData.ts";

export function initPhysics() {
  // 创建物理世界（修正重力值 gravity）
  const gravity = { x: 0.0, y: -10, z: 0.0 }; // 修正重力值
  const world = new RAPIER.World(gravity);

  // 创建地面
  const groundColliderDesc = RAPIER.ColliderDesc
      .cuboid(
          modelData.ground.width,
          modelData.ground.height,
          modelData.ground.depth
      )
      .setRestitution(1);
  world.createCollider(groundColliderDesc);

  // 创建动态刚体
  const rigidBodyDesc = RAPIER.RigidBodyDesc
      .dynamic()
      .setTranslation(0.0, 5.0, 0.0); // 动态刚体的初始位置
  const rigidBody = world.createRigidBody(rigidBodyDesc);

  // 创建立方体碰撞器（选择一种形状！）
  const colliderCuboidDesc = RAPIER.ColliderDesc.cuboid(
      modelData.cube.width,
      modelData.cube.height,
      modelData.cube.depth
  ) // 立方体形状
      .setRestitution(1) // 摩擦因数
      .setTranslation(0.0,  -modelData.cube.height/2, 0.0) //
      .setRestitutionCombineRule(RAPIER.CoefficientCombineRule.Min) // 设置摩擦;
  // 创建立圆球碰撞器（选择一种形状！）
  const colliderDesc = RAPIER.ColliderDesc
      .ball(modelData.sphere.radius) // 球体形状
      .setRestitution(0.7) // 摩擦因数
      .setTranslation(0.0, modelData.sphere.radius/2, 0.0) //
      .setRestitutionCombineRule(RAPIER.CoefficientCombineRule.Min) // 设置摩擦;

  // 关联到刚体
  world.createCollider(colliderDesc, rigidBody);
  world.createCollider(colliderCuboidDesc, rigidBody);

  return { world, rigidBody };
}
