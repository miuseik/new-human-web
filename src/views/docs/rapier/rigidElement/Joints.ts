/*
 * Rapier关节类型分类表
 *
 * | 关节类型   | 功能描述                     | 示例代码             |
 * |------------|------------------------------|----------------------|
 * | 固定关节   | 完全限制两个刚体的相对运动    | fixedJoint           |
 * | 旋转关节   | 允许绕单轴旋转                | revoluteJoint        |
 * | 滑动关节   | 允许沿单轴平移               | prismaticJoint       |
 * | 平面关节   | 允许二维平移和旋转           | planarJoint          |
 * | 球型关节   | 允许三维空间旋转             | sphericalJoint       |
 * | 万向节     | 允许两个旋转自由度           | universalJoint       |
 */

import * as RAPIER from '@dimforge/rapier3d';

let world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });

/*
 * 1. 创建两个动态刚体（body1和body2）
 */
const body1 = world.createRigidBody(
    RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(0.0, 2.0, 0.0)
);

const body2 = world.createRigidBody(
    RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(0.0, 0.0, 0.0)
);

/*
 * 2. 添加碰撞体
 */
world.createCollider(RAPIER.ColliderDesc.ball(0.5), body1);
world.createCollider(RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5), body2);

/*
 * 3. 固定关节（Fixed Joint）
 */
const fixedJointParams = RAPIER.JointData.fixed(
    { x: 0, y: 0, z: 0 },
    { w: 1, x: 0, y: 0, z: 0 },
    { x: 0, y: -2, z: 0 },
    { w: 1, x: 0, y: 0, z: 0 }
);
const fixedJoint = world.createImpulseJoint(fixedJointParams, body1, body2, true);

/*
 * 4. 旋转关节（Revolute Joint）
 */
const revoluteParams = RAPIER.JointData.revolute(
    { x: 0, y: 0, z: -3 }, // 铰链中心点
    { x: 1, y: 0, z: 0 }, // 旋转轴（X轴）
    { x: 1, y: 0, z: 0 }
);
const revoluteJoint = world.createImpulseJoint(revoluteParams, body1, body2, true);

/*
 * 5. 滑动关节（Prismatic Joint）
 */
const prismaticParams = RAPIER.JointData.prismatic(
    { x: 0, y: 0, z: 1 }, // 参考点
    { x: 0, y: 0, z: -3 }, // 初始位置
    { x: 1, y: 0, z: 0 } // 平移轴（X轴）
);
prismaticParams.limitsEnabled = true;
prismaticParams.limits = [-2, 5];
const prismaticJoint = world.createImpulseJoint(prismaticParams, body1, body2, true);

/*
 * 6. 替代方案：球型关节（Spherical Joint）
 */
const sphericalParams = RAPIER.JointData.spherical({ x: 0, y: 0, z: 0 },{ x: 0, y: 0, z: 0 }); // 中心点
const sphericalJoint = world.createImpulseJoint(sphericalParams, body1, body2, true);

/*
 * 7. 替代方案：万向节（通过两个旋转关节实现）
 */
// 第一个旋转关节（X轴）
const revoluteXParams = RAPIER.JointData.revolute(
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 }
);
const revoluteXJoint = world.createImpulseJoint(revoluteXParams, body1, body2, true);

// 第二个旋转关节（Y轴）
const revoluteYParams = RAPIER.JointData.revolute(
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 }
);
const revoluteYJoint = world.createImpulseJoint(revoluteYParams, body1, body2, true);
