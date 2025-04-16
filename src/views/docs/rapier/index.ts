// 物理世界初始化（重力方向：y轴负方向）
export const world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });

/* 刚体类型快速创建 */
// 固定刚体（不可移动）
export const fixedBodyDesc = RAPIER.RigidBodyDesc.fixed();
// 动态刚体（完全受物理引擎控制）
export const dynamicBodyDesc = RAPIER.RigidBodyDesc.dynamic();
// 速度型运动学刚体（通过速度控制）
export const velocityKinematicDesc = RAPIER.RigidBodyDesc.kinematicVelocityBased();
// 位置型运动学刚体（直接设置位置控制）
export const positionKinematicDesc = RAPIER.RigidBodyDesc.kinematicPositionBased();

/* 动态刚体详细配置示例 */
export const rigidBodyDesc = new RAPIER.RigidBodyDesc(RAPIER.RigidBodyType.Dynamic)
    // 设置初始位置（x,y,z坐标）
    .setTranslation(0.0, 5.0, 1.0) // 默认值：(0,0,0)
    // 设置初始旋转（四元数格式）
    .setRotation({ w: 1.0, x: 0.0, y: 0.0, z: 0.0 }) // 默认：无旋转
    // 设置初始线速度（米/秒）
    .setLinvel(1.0, 3.0, 4.0) // 默认值：(0,0,0)
    // 设置初始角速度（弧度/秒）
    .setAngvel({ x: 3.0, y: 0.0, z: 1.0 }) // 默认值：(0,0,0)
    // 调整重力影响比例（0.5表示半重力）
    .setGravityScale(0.5) // 默认值：1.0
    // 启用睡眠功能（静止时节省计算资源）
    .setCanSleep(true) // 默认值：true
    // 禁用连续刚体检测（CCD）
    .setCcdEnabled(false); // 默认值：false

// 创建刚体并获取句柄
export const rigidBody = world.createRigidBody(rigidBodyDesc);
export const rigidBodyHandle = rigidBody.handle; // 用于后续操作的唯一标识符
