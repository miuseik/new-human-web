import * as RAPIER from '@dimforge/rapier3d';

/*
 * 1. 创建物理世界
 */
let world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
/*
 * 2. 预定义三角网格和高度场数据
 */
// 示例三角网格数据（顶点坐标和索引）
const vertices = new Float32Array([
    // 顶点坐标（示例：一个简单的三角形平面）
    0.0, 0.0, 0.0,  // 顶点0
    1.0, 0.0, 0.0,  // 顶点1
    0.5, 1.0, 0.0,  // 顶点2
]);

const indices = new Uint32Array([ // 索引应为无符号整数数组
    0, 1, 2 // 索引构成一个三角形
]);

// 示例高度场数据（2x2网格的高度值）
const heights = new Float32Array([
    0.0, 1.0, // 第一行高度值
    1.0, 0.0  // 第二行高度值
]);

const scale = { x: 1.0, y: 1.0 ,z: 1.0 }; // 高度场缩放比例
/*
 * 2. 碰撞体描述符创建
 */
/*
 * 2.1 基础形状碰撞体
 */
/*
 * 2.1.1 球形碰撞体
 */
const ballColliderDesc = RAPIER.ColliderDesc.ball(0.5);

/*
 * 2.1.2 立方体碰撞体
 */
const cuboidColliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.2, 0.1);

/*
 * 2.1.3 胶囊体碰撞体（沿Y轴对称）
 */
const capsuleColliderDesc = RAPIER.ColliderDesc.capsule(0.5, 0.2);

/*
 * 2.1.4 三角网格碰撞体
 * vertices和indices需提前定义
 */
const trimeshColliderDesc = RAPIER.ColliderDesc.trimesh(vertices, indices);

/*
 * 2.1.5 高度场碰撞体
 * heights和scale需提前定义
 */
const heightfieldColliderDesc = RAPIER.ColliderDesc.heightfield(2, 2, heights, scale);

/*
 * 3. 碰撞体属性配置
 */
/*
 * 3.1 基础属性设置（位置、旋转、密度）
 */
const customColliderDesc = new RAPIER.ColliderDesc(new RAPIER.Ball(0.5))
    .setTranslation(1.0, 2.0, 3.0) // 碰撞体相对于刚体的位置
    .setRotation({ w: 1.0, x: 0.0, y: 0.0, z: 0.0 }) // 碰撞体相对于刚体的旋转
    .setDensity(1.3); // 密度值（影响质量计算）

/*
 * 3.2 物理属性设置（传感器、摩擦系数）
 */
const sensorColliderDesc = RAPIER.ColliderDesc.ball(0.5)
    .setSensor(true) // 设置为传感器（不触发碰撞响应）
    .setFriction(0.8); // 摩擦系数（默认0.5）

/*
 * 4. 碰撞体与刚体的关联
 */
/*
 * 4.1 创建独立碰撞体（不关联刚体）
 */
const standaloneColliderHandle = world.createCollider(customColliderDesc);

/*
 * 4.2 创建并关联刚体的碰撞体
 */
const dynamicBodyDesc = RAPIER.RigidBodyDesc.dynamic();
const dynamicBody = world.createRigidBody(dynamicBodyDesc);
const colliderAttachedToBody = world.createCollider(sensorColliderDesc, dynamicBody);

/*
 * 5. 碰撞体类型设置（创建时/运行时）
 */
/*
 * 5.1 创建时设置传感器类型
 */
const sensorBallDesc = RAPIER.ColliderDesc.ball(0.5)
    .setSensor(true);
const sensorCollider = world.createCollider(sensorBallDesc);

/*
 * 5.2 运行时设置传感器类型
 */
sensorCollider.setSensor(true);

/*
 * 6. 质量属性配置（影响刚体物理行为）
 */
/*
 * 6.1 通过密度设置质量
 */
const densityCuboidDesc = RAPIER.ColliderDesc.cuboid(1.0, 2.0, 1.0)
    .setDensity(2.0);

/*
 * 6.2 直接设置质量值
 */
const massCuboidDesc = RAPIER.ColliderDesc.cuboid(1.0, 2.0, 1.0)
    .setMass(0.8);

/*
 * 6.3 显式设置质量属性
 */
const massPropertiesDesc = RAPIER.ColliderDesc.cuboid(1.0, 2.0, 1.0)
    .setMassProperties(
        0.5, // 质量值（kg）
        { x: 0.0, y: 1.0, z: 0.0 }, // 质心坐标
        { x: 0.3, y: 0.2, z: 0.1 }, // 主惯性张量
        { w: 1.0, x: 0.0, y: 0.0, z: 0.0 } // 惯性坐标系（四元数）
    );

/*
 * 7. 碰撞体位置设置（创建时/运行时）
 */
/*
 * 7.1 创建时设置位置和旋转
 */
const positionedBallDesc = RAPIER.ColliderDesc.ball(0.5)
    .setTranslation(1.0, 2.0, 3.0)
    .setRotation({ w: 1.0, x: 0.0, y: 0.0, z: 0.0 });

/*
 * 7.2 运行时设置位置和旋转
 */
world.createCollider(positionedBallDesc).setTranslation({ x: 1.0, y: 2.0, z: 3.0 });
world.createCollider(positionedBallDesc).setRotation({ w: 1.0, x: 0.0, y: 0.0, z: 0.0 });

/*
 * 7.3 设置相对于父刚体的位置
 */
const parentColliderDesc = RAPIER.ColliderDesc.ball(0.5)
    .setTranslation(1.0, 2.0, 3.0);
const parentBody = world.createRigidBody(dynamicBodyDesc);
const childCollider = world.createCollider(parentColliderDesc, parentBody);
childCollider.setTranslationWrtParent({ x: 1.0, y: 2.0, z: 3.0 });

/*
 * 8. 摩擦与恢复系数配置
 */
/*
 * 8.1 创建时设置摩擦系数及混合规则
 */
const frictionBallDesc = RAPIER.ColliderDesc.ball(0.5)
    .setFriction(0.7) // 摩擦系数
    .setFrictionCombineRule(RAPIER.CoefficientCombineRule.Min); // 摩擦系数混合规则

/*
 * 8.2 运行时设置摩擦系数
 */
world.createCollider(frictionBallDesc).setFriction(0.7);

/*
 * 8.3 创建时设置恢复系数及混合规则
 */
const restitutionBallDesc = RAPIER.ColliderDesc.ball(0.5)
    .setRestitution(0.7) // 恢复系数（弹性）
    .setRestitutionCombineRule(RAPIER.CoefficientCombineRule.Min);

/*
 * 8.4 运行时设置恢复系数
 */
world.createCollider(restitutionBallDesc).setRestitution(0.7);

/*
 * 9. 碰撞组与求解组配置
 */
/*
 * 9.1 创建时设置碰撞组和求解组
 */
const groupColliderDesc = RAPIER.ColliderDesc.ball(0.5)
    .setCollisionGroups(0x000D0004) // 碰撞组掩码
    .setSolverGroups(0x00500010); // 求解组掩码

/*
 * 9.2 运行时设置碰撞组和求解组
 */
world.createCollider(groupColliderDesc).setCollisionGroups(0x000D0004);
world.createCollider(groupColliderDesc).setSolverGroups(0x000D0004);

/*
 * 10. 碰撞类型与事件配置
 */
/*
 * 10.1 创建时设置活动碰撞类型
 */
const activeCollisionDesc = RAPIER.ColliderDesc.ball(0.5)
    .setActiveCollisionTypes(
        RAPIER.ActiveCollisionTypes.DEFAULT |
        RAPIER.ActiveCollisionTypes.KINEMATIC_FIXED // 允许与固定刚体碰撞
    );

/*
 * 10.2 运行时设置活动碰撞类型
 */
world.createCollider(activeCollisionDesc).setActiveCollisionTypes(
    RAPIER.ActiveCollisionTypes.DEFAULT |
    RAPIER.ActiveCollisionTypes.KINEMATIC_FIXED
);

/*
 * 10.3 创建时设置活动事件
 */
const eventColliderDesc = RAPIER.ColliderDesc.ball(0.5)
    .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS); // 启用碰撞事件

/*
 * 10.4 运行时设置活动事件
 */
world.createCollider(eventColliderDesc).setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);

/*
 * 10.5 创建时设置活动钩子
 */
const hookColliderDesc = RAPIER.ColliderDesc.ball(0.5)
    .setActiveHooks(RAPIER.ActiveHooks.FILTER_CONTACT_PAIRS); // 启用接触对过滤
