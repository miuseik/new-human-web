// src/views/docs/rapier/rigidElement/scene.ts
import * as RAPIER from '@dimforge/rapier3d';

// === 物理世界初始化 ===
const world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
// 玩家刚体
const player_rigid_body = world.createRigidBody(
    RAPIER.RigidBodyDesc.kinematicPositionBased() // 示例：位置控制型刚体
        .setTranslation(0, 1.6, 0) // 初始位置（可选）
        .setRotation({ w: 1, x: 0, y: 0, z: 0 }) // 初始旋转（可选）
);
// 在物理世界初始化后创建示例碰撞体和刚体
const exampleRigidBody = world.createRigidBody(
    RAPIER.RigidBodyDesc.dynamic().setTranslation(5, 1, 0)
); // 示例动态刚体（可替换为其他类型）

const exampleCollider = world.createCollider(
    RAPIER.ColliderDesc.cuboid(1, 1, 1),
    exampleRigidBody
); // 示例立方体碰撞体
// 数据存储
const data = new Map<number, any>();
data.set(1, 10.0);
// === 射线检测（Ray Casting） ===
{
    const ray = new RAPIER.Ray(
        { x: 1.0, y: 2.0, z: 3.0 }, // 射线起点
        { x: 0.0, y: 1.0, z: 0.0 } // 射线方向（需归一化）
    );
    const maxToi = 4.0; // 最大检测距离
    const solid = true; // 是否仅检测实心碰撞体

    // 单次射线检测
    const hit = world.castRay(ray, maxToi, solid);
    if (hit) {
        const hitPoint = ray.pointAt(hit.timeOfImpact);
        console.log(`命中碰撞体 ${hit.collider}，撞击点 ${hitPoint}`);
    }

    // 带法线的射线检测
    const hitWithNormal = world.castRayAndGetNormal(ray, maxToi, solid);
    if (hitWithNormal) {
        const hitPoint = ray.pointAt(hitWithNormal.timeOfImpact);
        console.log(
            `命中碰撞体 ${hitWithNormal.collider}，撞击点 ${hitPoint}，法线 ${hitWithNormal.normal}`
        );
    }

    // 遍历所有射线命中结果
    world.intersectionsWithRay(ray, maxToi, solid, (hit) => {
        const hitPoint = ray.pointAt(hit.timeOfImpact);
        console.log(
            `命中碰撞体 ${hit.collider}，撞击点 ${hitPoint}，法线 ${hit.normal}`
        );
        return true; // 返回 false 终止检测
    });
}

// === 形状检测（Shape Casting） ===
{
    const shapePos = { x: 0.0, y: 1.0, z: 0.0 }; // 形状位置
    const shapeRot = { w: 1.0, x: 0.0, y: 0.0, z: 0.0 }; // 形状旋转
    const shapeVel = { x: 0.1, y: 0.4, z: 1.0 }; // 形状线速度
    const shape = new RAPIER.Cuboid(1.0, 2.0, 3.0); // 碰撞体形状
    const maxToi = 4.0; // 最大检测距离

    // 过滤参数
    const stopAtPenetration = true; // 是否在穿透时停止检测
    const filterFlags = RAPIER.QueryFilterFlags.EXCLUDE_DYNAMIC; // 排除动态刚体
    const filterGroups = 0x000b0001; // 碰撞组掩码
    // 假设 collider 和 rigidBody 已定义（需在实际代码中初始化）
// 使用示例碰撞体和刚体
    const filterExcludeCollider = exampleCollider; // 替换原 collider
    const filterExcludeRigidBody = exampleRigidBody; // 替换原 rigidBody

    const hit = world.castShape(
        shapePos,
        shapeRot,
        shapeVel,
        shape,
        0.0, // 目标移动距离
        maxToi,
        stopAtPenetration,
        filterFlags,
        filterGroups,
        filterExcludeCollider,
        filterExcludeRigidBody
    );
    if (hit) {
        console.log(
            `命中碰撞体 ${hit.collider}，撞击时间 ${hit.timeOfImpact}`
        );
    }
}

// === 点投影（Point Projection） ===
{
    const point = { x: 1.0, y: 2.0, z: 3.0 }; // 测试点坐标
    const solid = true; // 是否仅检测实心碰撞体

    // 获取最近的碰撞体投影
    const proj = world.projectPoint(point, solid);
    if (proj) {
        console.log(
            `投影到碰撞体 ${proj.collider}，投影点 ${proj.point}，是否在内部：${proj.isInside}`
        );
    }

    // 遍历所有包含该点的碰撞体
    world.intersectionsWithPoint(point, (handle) => {
        console.log(`碰撞体 ${handle} 包含该点`);
        return true; // 返回 false 终止检测
    });
}

// === 形状与场景检测（Shape Intersection） ===
{
    const shape = new RAPIER.Cuboid(1.0, 2.0, 3.0); // 检测形状
    const shapePos = { x: 1.0, y: 2.0, z: 3.0 }; // 形状位置
    const shapeRot = { w: 1.0, x: 0.0, y: 0.0, z: 0.0 }; // 形状旋转

    // 检测与形状相交的碰撞体
    world.intersectionsWithShape(shapePos, shapeRot, shape, (handle) => {
        console.log(`碰撞体 ${handle} 与形状相交`);
        return true;
    });
}

// === AABB 区域检测 ===
{
    const aabbCenter = { x: -1.0, y: -2.0, z: -3.0 }; // AABB 中心点
    const aabbHalfExtents = { x: 0.5, y: 0.6, z: 0.5 }; // AABB 半轴长度

    // 遍历与指定 AABB 相交的碰撞体
    world.collidersWithAabbIntersectingAabb(
        aabbCenter,
        aabbHalfExtents,
        (handle) => {
            console.log(`碰撞体 ${handle} 的 AABB 与测试 AABB 相交`);
            return true;
        }
    );
}

// === 带过滤条件的射线检测 ===
{
    const ray2D = new RAPIER.Ray(
        { x: 1.0, y: 2.0,z:0 }, // 2D 射线起点（Z轴默认0）
        { x: 0.0, y: 1.0,z:0 } // 2D 射线方向
    );
    const maxToi = 4.0; // 最大检测距离
    const solid = true; // 是否仅检测实心碰撞体

    // 过滤参数
    const filterFlags = RAPIER.QueryFilterFlags.EXCLUDE_DYNAMIC; // 排除动态刚体
    const filterGroups = 0x000b0001; // 碰撞组掩码
    const filterExcludeRigidBody = player_rigid_body/* 你的玩家刚体句柄 */;
    const filterPredicate = (collider: Collider) => data.get(collider.handle) == 10.0;
        /* 自定义条件，例如数据匹配 */;

    const hitFiltered = world.castRay(
        ray2D,
        maxToi,
        solid,
        filterFlags,
        filterGroups,
        null,
        filterExcludeRigidBody,
        filterPredicate
    );
    if (hitFiltered) {
        console.log("命中过滤后的射线检测结果");
    }
}
