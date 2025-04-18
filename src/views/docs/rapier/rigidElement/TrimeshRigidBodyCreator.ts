// src/tools/TrimeshRigidBodyCreator.ts

import { createWorld } from '@/tools/createWorld'; // 引入现有的createWorld类

export class TrimeshRigidBodyCreator {
    private createWorld: createWorld;

    constructor() {
        this.createWorld = new createWorld(); // 创建createWorld实例
    }

    /**
     * 根据JSON数据创建三角网格刚体和碰撞体
     * @param json - 包含模型数据和物理属性的JSON对象
     * @returns 创建的刚体和碰撞体
     */
    public createFromJson(json: any): { rigidbody: RAPIER.RigidBody; collider: RAPIER.ColliderHandle } {
        // 解析JSON数据
        const vertices = new Float32Array(json.vertices);
        const indices = new Uint32Array(json.indices);

        const position = json.position || { x: 0, y: 0, z: 0 };
        const rotation = json.rotation || { w: 1, x: 0, y: 0, z: 0 };
        const restitution = json.restitution || 0.5;
        const friction = json.friction || 0.7;
        const density = json.density || 1.0;

        // 创建三角网格刚体和碰撞体
        return this.createWorld.createTrimeshRigidBody(
            vertices,
            indices,
            position,
            rotation,
            restitution,
            friction,
            density
        );
    }
}
