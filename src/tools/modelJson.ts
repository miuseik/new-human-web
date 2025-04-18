// src/tools/modelJson.ts
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

export class ModelExporter {
    private loader: THREE.Loader;
    private geometry: THREE.BufferGeometry | null = null; // 移除对Geometry的支持

    constructor() {
        this.loader = new THREE.Loader();
    }

    /*
     * 加载模型并提取几何数据
     */
    public async loadModel(path: string, type: 'obj' | 'gltf' | 'glb' | 'stl'): Promise<void> {
        try {
            switch (type) {
                case 'obj':
                    return new Promise((resolve, reject) => {
                        const objLoader = new OBJLoader();
                        objLoader.load(path, (object) => {
                            // 确保使用BufferGeometry
                            this.geometry = object.children[0].geometry as THREE.BufferGeometry;
                            resolve();
                        }, undefined, reject);
                    });
                case 'gltf':
                case 'glb':
                    return new Promise((resolve, reject) => {
                        const gltfLoader = new GLTFLoader();
                        gltfLoader.load(path, (gltf) => {
                            this.geometry = gltf.scene.children[0].geometry as THREE.BufferGeometry;
                            resolve();
                        }, undefined, reject);
                    });
                case 'stl':
                    return new Promise((resolve, reject) => {
                        const stlLoader = new STLLoader();
                        stlLoader.load(path, (geometry) => {
                            this.geometry = geometry as THREE.BufferGeometry;
                            resolve();
                        }, undefined, reject);
                    });
                default:
                    throw new Error(`不支持的模型格式: ${type}`);
            }
        } catch (error) {
            console.error('模型加载失败:', error);
            throw error;
        }
    }

    /*
     * 提取模型数据并转换为JSON格式
     */
    public exportToJson(): ModelJsonData {
        if (!this.geometry) throw new Error('未加载模型');

        const vertices: number[] = [];
        const indices: number[] = [];

        // 仅处理BufferGeometry
        const positionAttribute = this.geometry.getAttribute('position');
        if (!positionAttribute) throw new Error('模型无顶点位置数据');

        for (let i = 0; i < positionAttribute.count; i++) {
            vertices.push(
                positionAttribute.getX(i),
                positionAttribute.getY(i),
                positionAttribute.getZ(i)
            );
        }

        // 处理索引数据
        if (this.geometry.index) {
            indices.push(...this.geometry.index.array);
        } else {
            // 如果没有索引，按顺序生成三角形索引（假设顶点按三角形排列）
            for (let i = 0; i < vertices.length / 3; i += 3) {
                indices.push(i, i + 1, i + 2);
            }
        }

        return {
            vertices: new Float32Array(vertices),
            indices: new Uint32Array(indices),
            type: this.geometry.type,
            metadata: {
                formatVersion: 4.5,
                type: 'Geometry',
                generator: 'Three.js ModelExporter'
            }
        };
    }

    /*
     * 可选：坐标系转换（例如Z-Up转Y-Up）
     */
    public convertCoordinateSystem(data: ModelJsonData): ModelJsonData {
        const { vertices } = data;
        const convertedVertices = new Float32Array(vertices.length);

        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const y = vertices[i + 1];
            const z = vertices[i + 2];

            // 示例：绕X轴旋转90度（Z-Up转为Y-Up）
            convertedVertices[i] = x;
            convertedVertices[i + 1] = z;
            convertedVertices[i + 2] = -y;
        }

        return {
            ...data,
            vertices: convertedVertices
        };
    }
}

interface ModelJsonData {
    vertices: Float32Array;
    indices: Uint32Array;
    type: string;
    metadata: {
        formatVersion: number;
        type: string;
        generator: string;
    };
}
