// src/core/createRapier3d.ts（严格复现案例代码结构）
import * as RAPIER from '@dimforge/rapier3d';
import { createWorld } from '@/tools/createWorld'; // 复用案例依赖

// 完全复现Joints.ts刚体创建逻辑
const createPhysicsWorld = () => {
  const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 }); // 重力设置与案例一致

  // 复现Joints.ts双刚体结构（动态刚体+动态刚体）
  const body1 = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
          .setTranslation(0, 2, 0) // 初始位置与案例一致
  );

  const body2 = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
          .setTranslation(0, 0, 0) // 地面刚体位置
  );

  // 复现碰撞体创建（球型+立方体）
  world.createCollider(
      RAPIER.ColliderDesc.ball(0.5), // 半径与案例一致
      body1
  );

  world.createCollider(
      RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5), // 尺寸与案例一致
      body2
  );

  // 复现固定关节完整实现（参数完全一致）
  const fixedJoint = world.createImpulseJoint(
      RAPIER.JointData.fixed(
          { x: 0, y: 0, z: 0 },        // body1锚点
          { w: 1, x: 0, y: 0, z: 0 },  // body1旋转
          { x: 0, y: -2, z: 0 },       // body2锚点
          { w: 1, x: 0, y: 0, z: 0 }   // body2旋转
      ),
      body1,
      body2,
      true // 激活状态与案例一致
  );

  // 复现旋转关节完整实现（含轴设置）
  const revoluteJoint = world.createImpulseJoint(
      RAPIER.JointData.revolute(
          { x: 0, y: 0, z: -3 }, // 铰链中心
          { x: 1, y: 0, z: 0 }, // 旋转轴（X轴）
          { x: 1, y: 0, z: 0 }  // 对齐方向
      ),
      body1,
      body2,
      true
  );

  // 复现滑动关节完整实现（含限位）
  const prismaticParams = RAPIER.JointData.prismatic(
      { x: 0, y: 0, z: 1 },  // 参考点
      { x: 0, y: 0, z: -3 }, // 初始位置
      { x: 1, y: 0, z: 0 }   // 平移轴（X轴）
  );
  prismaticParams.limitsEnabled = true; // 限位启用与案例一致
  prismaticParams.limits = [-2, 5];     // 限位范围与案例一致

  const prismaticJoint = world.createImpulseJoint(
      prismaticParams,
      body1,
      body2,
      true
  );

  return { world, body1, body2 };
};

// 导出接口严格遵循案例命名规范
export default {
  createPhysicsWorld,
  // 保留与TrimeshRigidBodyCreator的兼容性（参数完全一致）
  createTrimeshRigidBody: (createWorld: createWorld) =>
      createWorld.createTrimeshRigidBody.bind(createWorld)
};
