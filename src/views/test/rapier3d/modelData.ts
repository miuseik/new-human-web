// src/views/test/rapier3d/modelData.ts
import headJson from '@/assets/modelJson/head.json'; // 路径需根据实际项目结构调整
// 将对象转换为数值数组
const headerVertices = Object.values(headJson.vertices).map(Number);
const headerIndices = Object.values(headJson.indices).map(Number);

export const modelData = {
    cube: {
        width: 1,
        height: 1,
        depth: 1
    },
    sphere: {
        radius: 0.5
    },
    ground: {
        width: 200,
        height: 1,
        depth: 200
    },
    triangleMesh: {
        // 顶点数据（每个顶点的 x, y, z 坐标）
        vertices: [
            // 左眼
            -0.5, 0.5, 0,   // 左眼左上角 (v0)
            -0.3, 0.5, 0,   // 左眼右上角 (v1)
            -0.5, 0.3, 0,   // 左眼左下角 (v2)
            -0.3, 0.3, 0,   // 左眼右下角 (v3)

            // 右眼
            0.3, 0.5, 0,    // 右眼左上角 (v4)
            0.5, 0.5, 0,    // 右眼右上角 (v5)
            0.3, 0.3, 0,    // 右眼左下角 (v6)
            0.5, 0.3, 0,    // 右眼右下角 (v7)

            // 鼻子
            0, 0.2, 0,      // 鼻子顶部 (v8)
            -0.1, 0, 0,     // 鼻子左下角 (v9)
            0.1, 0, 0,      // 鼻子右下角 (v10)

            // 嘴巴
            -0.3, -0.2, 0,  // 嘴巴左上角 (v11)
            0.3, -0.2, 0,   // 嘴巴右上角 (v12)
            -0.5, -0.4, 0,  // 嘴巴左下角 (v13)
            0.5, -0.4, 0,   // 嘴巴右下角 (v14)
            -0.3, -0.4, 0,  // 嘴巴中间左 (v15)
            0.3, -0.4, 0    // 嘴巴中间右 (v16)
        ],
        // 面数据（每个面由三个顶点索引组成）
        indices: [
            // 左眼
            0, 1, 2,        // 左眼三角形 1
            1, 3, 2,        // 左眼三角形 2

            // 右眼
            4, 5, 6,        // 右眼三角形 1
            5, 7, 6,        // 右眼三角形 2

            // 鼻子
            8, 9, 10,       // 鼻子三角形 1
            8, 10, 9,       // 鼻子三角形 2 （为了形成尖角）

            // 嘴巴
            11, 12, 15,     // 嘴巴三角形 1
            12, 14, 16,     // 嘴巴三角形 2
            11, 15, 13,     // 嘴巴三角形 3
            14, 16, 13      // 嘴巴三角形 4
        ],

    },
    headerModel: {
        vertices: headerVertices,
        indices: headerIndices
    }
};
