<template>
  <div class="model-importer-container">
    <!-- 文件输入框 -->
    <input
      type="file"
      @change="handleFileSelect"
      accept=".obj,.gltf,.glb,.stl"
      class="file-input"
    />

    <!-- 拖拽区域 -->
    <div
      class="drop-zone"
      @dragover.prevent
      @dragenter.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false"
      @drop.prevent="handleFileDrop"
    >
      <p v-if="!dragOver">拖拽模型文件到这里 或 点击选择文件</p>
      <p v-else>释放文件以上传</p>
    </div>

    <!-- 渲染容器 -->
    <div id="render-container" ref="renderContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ModelExporter } from '@/tools/modelJson';
import { ModelRenderer } from '@/tools/renderJson';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {TrimeshRigidBodyCreator} from "@/views/docs/rapier/rigidElement/TrimeshRigidBodyCreator.ts";
// 响应式变量
const dragOver = ref(false);
const convertedData = ref<any>(null);
const renderContainer = ref<HTMLDivElement | null>(null);

// 初始化Three.js基础组件
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const modelExporter = new ModelExporter();
let controls: OrbitControls | null = null;
let modelRenderer: ModelRenderer | null = null;

// 初始化Three.js环境
const initThree = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (renderContainer.value) {
    renderContainer.value.appendChild(renderer.domElement);
  }

  // 环境光
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  // 主光源
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // 轨道控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // ModelRenderer实例
  modelRenderer = new ModelRenderer(scene, camera, renderer);

  // 渲染循环
  const animate = () => {
    requestAnimationFrame(animate);
    controls?.update();
    renderer.render(scene, camera);
  };
  animate();
};

// 生命周期钩子
onMounted(() => {
  initThree();
});

onBeforeUnmount(() => {
  controls?.dispose();
  renderer.dispose();
});

// 文件处理方法
const processFile = async (file: File) => {
  try {
    const url = URL.createObjectURL(file);
    const type = file.name.split('.').pop()?.toLowerCase() as
      'obj' | 'gltf' | 'glb' | 'stl';
    // 清空场景
    modelRenderer?.clearScene();

    // 加载并转换模型
    await modelExporter.loadModel(url, type);
    let data = modelExporter.exportToJson();
    data = modelExporter.convertCoordinateSystem(data);

    console.log("data", data)
    convertedData.value = data;

    // 创建TrimeshRigidBodyCreator实例
    const trimeshCreator = new TrimeshRigidBodyCreator();

    // 根据JSON数据创建三角网格刚体和碰撞体
    const { rigidbody, collider } = trimeshCreator.createFromJson(data);

    // 保存JSON文件到本地
    saveJsonToFile(data, 'head.json');
    // 渲染到Three.js场景
    modelRenderer?.renderModel(data);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('模型处理失败:', error);
    alert('模型处理失败，请检查格式或内容');
  }
};
// 保存JSON文件到本地的函数
const saveJsonToFile = (data: any, filename: string) => {
  // 将数据转换为JSON字符串
  const jsonString = JSON.stringify(data, null, 2);

  // 创建Blob对象
  const blob = new Blob([jsonString], { type: 'application/json' });

  // 创建Blob URL
  const url = URL.createObjectURL(blob);

  // 创建<a>元素
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;

  // 触发点击事件
  document.body.appendChild(a);
  a.click();

  // 移除<a>元素
  document.body.removeChild(a);

  // 释放Blob URL
  URL.revokeObjectURL(url);
};
// 文件选择事件
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) processFile(file);
};

// 文件拖拽事件
const handleFileDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0];
  if (file) processFile(file);
};
</script>

<style>
.model-importer-container {
  padding: 20px;
  text-align: center;
}

.file-input {
  display: none;
}

.drop-zone {
  border: 3px dashed #ccc;
  padding: 20px;
  margin: 20px 0;
  border-radius: 8px;
  transition: border-color 0.3s;
  width: 300px;
  margin: 0 auto;
}

.drop-zone:hover {
  border-color: #666;
}

#render-container {
  width: 100%;
  height: 600px;
  margin: 20px 0;
}
</style>
