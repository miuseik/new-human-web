// src/tools/createWorld.ts
import * as RAPIER from '@dimforge/rapier3d';

export class createWorld {
    private world: RAPIER.World;

    constructor() {
        // 创建物理世界（重力方向为Y轴负方向）
        this.world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
    }

    // 根据模型JSON数据创建三角网格刚体和碰撞体
    public createTrimeshRigidBody(
        vertices: Float32Array, // 模型顶点数组（每个顶点3个float）
        indices: Uint32Array, // 索引数组（每个三角形3个uint）
        position: { x: number, y: number, z: number }, // 初始位置
        rotation: { w: number, x: number, y: number, z: number }, // 初始旋转（四元数）
        restitution: number, // 恢复系数（弹力，范围0-1）
        friction: number, // 摩擦系数
        density: number // 密度（影响质量）
    ): { rigidbody: RAPIER.RigidBody; collider: RAPIER.ColliderHandle } {
        // 1. 创建动态刚体描述符
        const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(position.x, position.y, position.z) // 初始位置
            .setRotation(rotation) // 初始旋转
            .setGravityScale(1.0); // 启用重力

        // 2. 创建三角网格碰撞体描述符
        const colliderDesc = RAPIER.ColliderDesc.trimesh(vertices, indices)
            .setRestitution(restitution) // 设置弹力系数
            .setFriction(friction) // 设置摩擦系数
            .setDensity(density); // 设置密度

        // 3. 创建刚体并附加碰撞体
        const rigidBody = this.world.createRigidBody(rigidBodyDesc);
        const collider = this.world.createCollider(colliderDesc, rigidBody);

        return { rigidbody: rigidBody, collider: collider };
    }

    // 获取物理世界实例（用于其他模块调用）
    public getWorld(): RAPIER.World {
        return this.world;
    }

    // 物理步进更新（需在游戏循环中调用）
    public step(dt: number): void {
        this.world.step();
    }
}
