// 导入 Three.js 库
import * as THREE from 'three';
// 导入 OrbitControls 控制器，用于控制摄像机的旋转和缩放
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 创建一个新的场景
export function createScene() {
  return new THREE.Scene();
}

// 创建一个透视摄像机，参数分别为视角、宽高比、近裁剪面、远裁剪面
export function createCamera() {
  return new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
}

// 创建一个 WebGL 渲染器，并将其添加到指定的 HTML 容器中
export function createRenderer(container: HTMLElement) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  // 设置渲染器的大小为窗口的宽高
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 将渲染器的 DOM 元素添加到容器中
  container.appendChild(renderer.domElement);
  return renderer;
}

// 创建一个渐变纹理
export function createGradientTexture() {
  // 创建一个 canvas 元素
  const canvas = document.createElement('canvas');
  // 设置 canvas 的宽高
  canvas.width = 2;
  canvas.height = 2;
  // 获取 canvas 的 2D 上下文
  const context = canvas.getContext('2d');
  // 如果获取不到上下文，返回 null
  if (!context) return null;

  // 创建一个线性渐变
  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  // 添加颜色停止点，从顶部到底部渐变
  gradient.addColorStop(0, '#87CEEB'); // 天蓝色
  gradient.addColorStop(1, '#444444'); // 浅灰色

  // 设置填充样式为渐变
  context.fillStyle = gradient;
  // 填充整个 canvas
  context.fillRect(0, 0, canvas.width, canvas.height);

  // 返回一个基于 canvas 的纹理
  return new THREE.CanvasTexture(canvas);
}

// 创建一个地面
export function createGround() {
  // 创建一个平面几何体，宽高为 20x20
  const groundGeometry = new THREE.PlaneGeometry(20, 20);
  // 创建一个基础材质，颜色为浅灰色
  const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x444444 });
  // 创建一个网格对象，将几何体和材质结合
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  // 旋转地面使其水平
  ground.rotation.x = -Math.PI / 2;
  // 设置地面的 Y 轴位置
  ground.position.y = -0.1;
  return ground;
}

// 创建一个立方体
export function createCube() {
  // 创建一个立方体几何体，边长为 1
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  // 创建一个基础材质，颜色为绿色
  // const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cubeMaterial = new THREE.MeshNormalMaterial();
  // 创建一个网格对象，将几何体和材质结合
  return new THREE.Mesh(cubeGeometry, cubeMaterial);
}

// 创建一个球体
export function createSphere(radius: number) {
  // 创建一个球体几何体
  const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32); // 分段数为 32
  // 创建一个基础材质，颜色为绿色
  const sphereMaterial = new THREE.MeshNormalMaterial();
  // 创建一个网格对象，将几何体和材质结合
  return new THREE.Mesh(sphereGeometry, sphereMaterial);
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
