// The world that will contain our rigid-bodies.
import * as RAPIER from '@dimforge/rapier3d';
/*
 * 1. 创建物理世界
 */
let world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });

/*
 * 2. 不同类型的刚体描述符创建
 */
/*
 * 2.1 固定刚体（不可移动）
 */
const fixedBodyDesc = RAPIER.RigidBodyDesc.fixed();

/*
 * 2.2 动态刚体（受物理引擎驱动）
 */
const dynamicBodyDesc = RAPIER.RigidBodyDesc.dynamic();

/*
 * 2.3 速度控制型运动刚体（通过线速度控制）
 */
const velocityBasedKinematicDesc = RAPIER.RigidBodyDesc.kinematicVelocityBased();

/*
 * 2.4 位置控制型运动刚体（通过坐标直接控制）
 */
const positionBasedKinematicDesc = RAPIER.RigidBodyDesc.kinematicPositionBased();

/*
 * 2.5 使用枚举类型创建动态刚体
 */
const enumBasedBodyDesc = new RAPIER.RigidBodyDesc(RAPIER.RigidBodyType.Dynamic);

/*
 * 3. 刚体位置与旋转设置
 */
/*
 * 3.1 创建时设置位置和旋转
 */
const positionSetupDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0.0, 5.0, 1.0) // 初始位置坐标（x,y,z）
    .setRotation({ w: 1.0, x: 0.0, y: 0.0, z: 0.0 }); // 初始旋转（四元数）

const positionedBody = world.createRigidBody(positionSetupDesc);

/*
 * 3.2 创建后设置位置和旋转（保持激活状态）
 */
positionedBody.setTranslation(
    { x: 0.0, y: 5.0, z: 1.0 },
    true // 确保刚体处于激活状态
);
positionedBody.setRotation(
    { w: 1.0, x: 0.0, y: 0.0, z: 0.0 },
    true // 确保刚体处于激活状态
);

/*
 * 4. 刚体速度与力操作
 */
/*
 * 4.1 创建时设置线性/角速度
 */
const velocitySetupDesc = RAPIER.RigidBodyDesc.dynamic()
    .setLinvel(1.0, 3.0, 4.0) // 初始线性速度（x,y,z）
    .setAngvel({ x: 3.0, y: 0.0, z: 1.0 }); // 初始角速度（x,y,z）

const velocityBody = world.createRigidBody(velocitySetupDesc);

/*
 * 4.2 创建后设置速度（保持激活状态）
 */
velocityBody.setLinvel(
    { x: 1.0, y: 3.0, z: 4.0 },
    true // 确保刚体处于激活状态
);
velocityBody.setAngvel(
    { x: 3.0, y: 0.0, z: 0.0 },
    true // 确保刚体处于激活状态
);

/*
 * 4.3 力与扭矩操作
 */
velocityBody.resetForces(true); // 重置所有线性力为零
velocityBody.resetTorques(true); // 重置所有角力矩为零
velocityBody.addForce(
    { x: 0.0, y: 1000.0, z: 0.0 },
    true // 确保刚体处于激活状态
);
velocityBody.addTorque(
    { x: 100.0, y: 0.0, z: 0.0 },
    true // 确保刚体处于激活状态
);
velocityBody.addForceAtPoint(
    { x: 0.0, y: 1000.0, z: 0.0 }, // 力向量
    { x: 1.0, y: 2.0, z: 3.0 }, // 作用点坐标
    true // 确保刚体处于激活状态
);

velocityBody.applyImpulse(
    { x: 0.0, y: 1000.0, z: 0.0 },
    true // 确保刚体处于激活状态
);
velocityBody.applyTorqueImpulse(
    { x: 100.0, y: 0.0, z: 0.0 },
    true // 确保刚体处于激活状态
);
velocityBody.applyImpulseAtPoint(
    { x: 0.0, y: 1000.0, z: 0.0 }, // 冲量向量
    { x: 1.0, y: 2.0, z: 3.0 }, // 作用点坐标
    true // 确保刚体处于激活状态
);

/*
 * 5. 碰撞体与质量属性设置
 */
/*
 * 5.1 创建带有球形碰撞体的刚体
 */
const colliderBodyDesc = RAPIER.RigidBodyDesc.dynamic();
const colliderBody = world.createRigidBody(colliderBodyDesc);

const ballColliderDesc = RAPIER.ColliderDesc.ball(1.0) // 半径1单位
    .setDensity(2.0); // 密度设置为2.0（默认1.0）

world.createCollider(ballColliderDesc, colliderBody);

/*
 * 5.2 设置附加质量属性
 */
const massPropertiesDesc = RAPIER.RigidBodyDesc.dynamic()
    .setAdditionalMass(0.5) // 附加质量（单位：kg）
    .setAdditionalMassProperties(
        0.5, // 质量值（kg）
        { x: 0.0, y: 1.0, z: 0.0 }, // 质心坐标
        { x: 0.3, y: 0.2, z: 0.1 }, // 主惯性张量
        { w: 1.0, x: 0.0, y: 0.0, z: 0.0 } // 惯性坐标系（四元数）
    );

const massBody = world.createRigidBody(massPropertiesDesc);

/*
 * 6. 锁定轴与阻尼设置
 */
/*
 * 6.1 创建时锁定轴
 */
const lockedAxesDesc = RAPIER.RigidBodyDesc.dynamic()
    .lockTranslations() // 锁定所有线性轴的移动
    .lockRotations() // 锁定所有角轴的旋转
    .enabledRotations(true, false, false); // 仅启用X轴旋转

const lockedBody = world.createRigidBody(lockedAxesDesc);

/*
 * 6.2 创建后锁定轴
 */
lockedBody.lockTranslations(true, true); // 锁定所有线性轴
lockedBody.setEnabledRotations(
    true, // X轴可旋转
    false, // Y轴不可旋转
    false, // Z轴不可旋转
    true // 确保刚体处于激活状态
);

/*
 * 6.3 设置线性/角阻尼
 */
const dampingDesc = RAPIER.RigidBodyDesc.dynamic()
    .setLinearDamping(0.5) // 线性阻尼系数0.5
    .setAngularDamping(1.0); // 角阻尼系数1.0

const dampingBody = world.createRigidBody(dampingDesc);
dampingBody.setLinearDamping(0.5); // 运行时设置线性阻尼

/*
 * 6.4 设置支配组（碰撞过滤）
 */
const dominanceDesc = RAPIER.RigidBodyDesc.dynamic()
    .setDominanceGroup(10); // 设置支配组ID为10

const dominanceBody = world.createRigidBody(dominanceDesc);
dominanceBody.setDominanceGroup(10); // 运行时设置

/*
 * 7. CCD（连续刚体动力学）设置
 */
/*
 * 7.1 创建时启用CCD
 */
const ccdEnabledDesc = RAPIER.RigidBodyDesc.dynamic()
    .setCcdEnabled(true);

const ccdBody = world.createRigidBody(ccdEnabledDesc);
ccdBody.enableCcd(true); // 运行时启用CCD

