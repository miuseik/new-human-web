// src/views/docs/rapier/rigidElement/controller.ts
import * as RAPIER from '@dimforge/rapier3d';

let world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });

// === 创建角色碰撞体 ===
// 1. 创建角色刚体（使用位置控制型运动刚体）
const rigidBody = world.createRigidBody(
    RAPIER.RigidBodyDesc.kinematicPositionBased()
);

// 2. 创建角色碰撞体（示例：立方体碰撞体）
const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 1.8, 0.5); // 宽x高x深
const collider = world.createCollider(colliderDesc, rigidBody); // 定义 collider 变量

// === 角色控制器配置 ===
let offset = 0.01; // 控制器与环境的最小间隙
let characterController = world.createCharacterController(offset); // 创建控制器

// === 移动向量初始化 ===
// 3. 定义移动方向（示例：玩家输入方向）
let desiredTranslation = new RAPIER.Vector3(0.1, 0.0, 0.0); // 水平移动向量（X轴正方向）
let desiredMovementVector = desiredTranslation; // 或根据逻辑单独定义


// world.removeCharacterController(characterController); // 移除控制器（示例，需在不再使用时调用）
// === 移动计算与结果应用 ===
characterController = world.createCharacterController(offset);
characterController.computeColliderMovement(
    collider, // 需要移动的碰撞体
    desiredTranslation // 理想移动向量（假设无障碍时的位移）
);
let correctedMovement = characterController.computedMovement(); // 获取修正后的移动结果
// 应用修正后的位移到刚体（需根据具体逻辑实现）

// === 控制器方向设置 ===
characterController = world.createCharacterController(0.01);
characterController.setUp({ x: 0.0, y: 0.0, z: 1.0 }); // 设置控制器的向上方向为 Z 轴（默认为 Y 轴）

// === 坡度控制设置 ===
characterController = world.createCharacterController(0.01);
characterController.setMaxSlopeClimbAngle(45 * Math.PI / 180); // 设置最大可攀爬坡度（45度）
characterController.setMinSlopeSlideAngle(30 * Math.PI / 180); // 设置自动滑下坡度阈值（30度以下自动滑下）

// === 自动功能配置 ===
characterController = world.createCharacterController(0.01);
characterController.enableAutostep(0.5, 0.2, true); // 启用自动跨越：最大台阶高度0.5，最小台阶宽度0.2，允许动态刚体
// characterController.disableAutostep(); // 禁用自动跨越

characterController.enableSnapToGround(0.5); // 启用自动吸附地面：垂直距离小于0.5时自动下落
// characterController.disableSnapToGround(); // 禁用自动吸附

// === 碰撞事件处理 ===
characterController = world.createCharacterController(0.01);
characterController.computeColliderMovement(collider, desiredMovementVector); // 计算移动后的碰撞修正

// 遍历所有碰撞事件
for (let i = 0; i < characterController.numComputedCollisions(); i++) {
    let collision = characterController.computedCollision(i); // 获取第i次碰撞信息
    // 处理碰撞数据（如记录碰撞法线、位置等）
}

// === 动态刚体交互控制 ===
characterController.setApplyImpulsesToDynamicBodies(true); // 允许对动态刚体施加碰撞冲量（如推动箱子）
