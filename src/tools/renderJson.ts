import * as THREE from 'three';

export class ModelRenderer {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;

    constructor(
        scene: THREE.Scene,
        camera: THREE.PerspectiveCamera,
        renderer: THREE.WebGLRenderer
    ) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
    }

    /*
     * 渲染模型JSON数据到场景
     */
    public renderModel(data: any): void {
        if (!data.vertices || !data.indices) {
            throw new Error('无效的模型数据：缺少顶点或索引');
        }

        // 创建几何体
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(data.vertices, 3)
        );
        if (data.indices) {
            geometry.setIndex(new THREE.Uint32BufferAttribute(data.indices, 1));
        }

        // 创建材质（示例：基本材质）
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true // 显示线框方便调试
        });

        // 创建网格并添加到场景
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);

        // 调整相机视角（示例）
        this.camera.position.z = 5;
        this.camera.lookAt(mesh.position);
    }

    /*
     * 清空场景中的模型
     */
    public clearScene(): void {
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
    }
}
