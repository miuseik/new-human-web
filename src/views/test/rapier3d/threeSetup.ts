// 导入 Three.js 库
import * as THREE from 'three';

import * as dat from 'dat.gui';

// 导入 OrbitControls 控制器，用于控制摄像机的旋转和缩放
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {modelData} from "@/views/test/rapier3d/modelData.ts";
import {Sky} from './shader/sky';

// 创建一个新的场景
export function createScene() {
    return new THREE.Scene();
}

// 在threeSetup.ts中新增函数
export function createShaderMaterial(): THREE.ShaderMaterial {
    const shader = {
        uniforms: {
            u_time: {value: 0}, // 动态时间参数
            u_color: {value: new THREE.Color(0xff0000)} // 基础颜色
        },
        vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
        fragmentShader: `
      uniform vec3 u_color;
      uniform float u_time;
      varying vec2 vUv;
      void main() {
        // 示例：基于UV坐标和时间的渐变颜色
        vec3 color = u_color + 0.5*sin(u_time + vUv.x*10.0);
        gl_FragColor = vec4(color, 1.0);
      }
    `
    };
    return new THREE.ShaderMaterial({
        uniforms: shader.uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
        side: THREE.DoubleSide // 双面渲染
    });
}

// 创建一个透视摄像机，参数分别为视角、宽高比、近裁剪面、远裁剪面
export function createCamera() {
    return new THREE.PerspectiveCamera(
        60,// 视角
        window.innerWidth / window.innerHeight, // 视角宽高比
        100, // 近裁剪面
        2000000 // 远裁剪面
    );
}

// 创建一个 WebGL 渲染器，并将其添加到指定的 HTML 容器中
export function createRenderer(container: HTMLElement) {
    const renderer = new THREE.WebGLRenderer({antialias: true});
    // 设置渲染器的大小为窗口的宽高
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;

    // 将渲染器的 DOM 元素添加到容器中
    container.appendChild(renderer.domElement);
    return renderer;
}

// 创建一个渐变纹理
export function createGradientTexture(scene, renderer, camera) {

    // Add Sky
    let sky = new Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);

    let sun = new THREE.Vector3();

    /// GUI

    const effectController = {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.7,
        elevation: 2,
        azimuth: 180,
        exposure: renderer.toneMappingExposure
    };

    function guiChanged() {

        const uniforms = sky.material.uniforms;
        uniforms['turbidity'].value = effectController.turbidity;
        uniforms['rayleigh'].value = effectController.rayleigh;
        uniforms['mieCoefficient'].value = effectController.mieCoefficient;
        uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

        const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
        const theta = THREE.MathUtils.degToRad(effectController.azimuth);

        sun.setFromSphericalCoords(1, phi, theta);

        uniforms['sunPosition'].value.copy(sun);

        renderer.toneMappingExposure = effectController.exposure;
        renderer.render(scene, camera);

    }

    const gui = new dat.GUI();

    gui.add(effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(guiChanged);
    gui.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiChanged);
    gui.add(effectController, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(guiChanged);
    gui.add(effectController, 'mieDirectionalG', 0.0, 1, 0.001).onChange(guiChanged);
    gui.add(effectController, 'elevation', 0, 90, 0.1).onChange(guiChanged);
    gui.add(effectController, 'azimuth', -180, 180, 0.1).onChange(guiChanged);
    gui.add(effectController, 'exposure', 0, 1, 0.0001).onChange(guiChanged);

    guiChanged();
}

// 创建一个地面
export function createGround() {
    // 创建一个平面几何体，宽高为 20x20
    const groundGeometry = new THREE.PlaneGeometry(
        modelData.ground.width,
        modelData.ground.depth
    );
    // 创建一个基础材质，颜色为浅灰色
    const groundMaterial = new THREE.MeshBasicMaterial({color: 0x444444});
    // 创建一个网格对象，将几何体和材质结合
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    // 旋转地面使其水平
    ground.rotation.x = -Math.PI / 2;
    // 设置地面的 Y 轴位置
    ground.position.y = -modelData.ground.height;
    return ground;
}

// 创建一个立方体
export function createCube() {
    // 创建一个立方体几何体，边长为 1
    const geometry = new THREE.BoxGeometry(
        modelData.cube.width,
        modelData.cube.height,
        modelData.cube.depth
    );
    // 创建一个基础材质，颜色为绿色
    // const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cubeMaterial = createShaderMaterial();
    const mesh = new THREE.Mesh(geometry, cubeMaterial);

    // 添加时间更新逻辑（需在渲染循环中调用）
    mesh.material.uniforms.u_time.value += 0.05;
    return mesh;
}

// 创建一个球体
export function createSphere() {
    // 创建一个球体几何体
    const geometry = new THREE.SphereGeometry(
        modelData.sphere.radius, 20, 20
    ); // 分段数为 32
    // 创建一个基础材质，颜色为绿色
    // const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cubeMaterial = createShaderMaterial();
    const mesh = new THREE.Mesh(geometry, cubeMaterial);

    // 添加时间更新逻辑（需在渲染循环中调用）
    mesh.material.uniforms.u_time.value += 0.05;
    return mesh;
}

// 创建一个三角网格
export function createTriangleMesh() {
    const vertices = modelData.headerModel.vertices;
    const indices = modelData.headerModel.indices;

    // 创建顶点缓冲区
    const verticesArray = new Float32Array(vertices);
    const positionAttribute = new THREE.BufferAttribute(verticesArray, 3);

    // 创建索引缓冲区
    const indicesArray = new Uint32Array(indices);
    const indexAttribute = new THREE.BufferAttribute(indicesArray, 1);

    // 创建几何体
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', positionAttribute);
    geometry.setIndex(indexAttribute);

    // 创建材质
    const material = new THREE.MeshNormalMaterial();

    // 创建网格对象
    return new THREE.Mesh(geometry, material);
}

// 创建 OrbitControls 控制器，用于控制摄像机的旋转和缩放
export function createControls(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
    // 创建控制器实例
    const controls = new OrbitControls(camera, renderer.domElement);
    // 启用阻尼效果，使控制更平滑
    controls.enableDamping = true;
    // 设置阻尼因子
    controls.dampingFactor = 0.25;
    // 启用缩放功能
    controls.enableZoom = true;
    // 设置最大缩放距离
    controls.maxDistance = 50;
    // 设置最小缩放距离
    controls.minDistance = 1;
    // 更新控制器状态
    controls.update();
    return controls;
}
