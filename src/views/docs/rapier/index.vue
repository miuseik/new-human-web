<template>
  <div class="docs-container">
    <!-- 左侧文档区 -->
    <div class="left-panel">
      <CodeBlock title="物理配置代码示例">
        <pre>{{ selectedCode }}</pre>
      </CodeBlock>

      <div class="control-panel">
        <h4>实时参数控制</h4>
        <div>
          <label>刚体类型：
            <select v-model="selectedType">
              <option v-for="type in rigidBodyTypes" :key="type.value">{{ type.text }}</option>
            </select>
          </label>
        </div>
        <div>
          <label>X坐标：
            <input type="number" v-model.number="position.x">
          </label>
          <label>Y坐标：
            <input type="number" v-model.number="position.y">
          </label>
          <label>Z坐标：
            <input type="number" v-model.number="position.z">
          </label>
        </div>
        <button @click="resetSimulation">重置场景</button>
      </div>
    </div>

    <!-- 右侧3D视图 -->
    <div class="right-panel">
      <div ref="threeContainer" class="three-container"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as RAPIER from '@dimforge/rapier3d'
// 工具函数：创建三维向量
function createVector(x: number, y: number, z: number) {
  return {x,y,z};
}
const threeContainer = ref<HTMLDivElement | null>(null)
const rigidBody = ref()
const world = new RAPIER.World(createVector(0, -9.81, 0))

// 参数绑定
const selectedType = ref(RAPIER.RigidBodyType.Dynamic)
const position = ref({ x: 0, y: 5, z: 0 })
const rigidBodyTypes = [
  { text: 'Fixed', value: RAPIER.RigidBodyType.Fixed },
  { text: 'Dynamic', value: RAPIER.RigidBodyType.Dynamic },
  { text: 'Kinematic Velocity', value: RAPIER.RigidBodyType.KinematicVelocity },
  { text: 'Kinematic Position', value: RAPIER.RigidBodyType.KinematicPosition }
]

// 代码示例动态切换
const selectedCode = computed(() => {
  switch (selectedType.value) {
    case RAPIER.RigidBodyType.Fixed: return `const body = RAPIER.RigidBodyDesc.fixed();`
    case RAPIER.RigidBodyType.Dynamic: return `const body = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(${position.value.x }, ${position.value.y }, ${position.value.z })
      ;`
    case RAPIER.RigidBodyType.KinematicVelocity: return `const body = RAPIER.RigidBodyDesc.kinematicVelocityBased()
      .setLinVel(2, 0, 0)
      ;`
    case RAPIER.RigidBodyType.KinematicPosition: return `const body = RAPIER.RigidBodyDesc.kinematicPositionBased()
      .setTranslation(${position.value.x }, ${position.value.y }, ${position.value.z })
      ;`
    default: return ''
  }
})

// Three.js 初始化
onMounted(() => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(800, 600)
  threeContainer.value?.appendChild(renderer.domElement)

  // 场景基础设置
  const ambientLight = new THREE.AmbientLight(0x404040)
  scene.add(ambientLight)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(1, 1, 1)
  scene.add(directionalLight)

  // 物理引擎与Three.js同步
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
  const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
  const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
  scene.add(cubeMesh)

  // 初始化物理刚体
  createRigidBody()

  // 渲染循环
  const animate = () => {
    requestAnimationFrame(animate)
    updatePhysics()
    renderer.render(scene, camera)
  }
  animate()

  // 摄像机控制
  const controls = new OrbitControls(camera, renderer.domElement)
  camera.position.set(5, 5, 5)
  controls.update()
})

// 物理引擎核心逻辑
const createRigidBody = () => {
  // 清理现有刚体
  if (rigidBody.value) {
    world.remove(rigidBody.value)
    rigidBody.value = null
  }

  // 根据选择创建不同类型的刚体
  let desc: RAPIER.RigidBodyDesc;
  switch (selectedType.value) {
    case RAPIER.RigidBodyType.Fixed:
      desc = RAPIER.RigidBodyDesc.fixed();
      break;
    case RAPIER.RigidBodyType.Dynamic:
      desc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(position.value.x, position.value.y, position.value.z)
        .setGravityScale(1);
      break;
    case RAPIER.RigidBodyType.KinematicVelocity:
      desc = RAPIER.RigidBodyDesc.kinematicVelocityBased()
        .setLinVel(2, 0, 0);
      break;
    case RAPIER.RigidBodyType.KinematicPosition:
      desc = RAPIER.RigidBodyDesc.kinematicPositionBased()
        .setTranslation(position.value.x, position.value.y, position.value.z);
      break;
    default:
      desc = RAPIER.RigidBodyDesc.dynamic();
  }

  // 创建刚体和碰撞体
  rigidBody.value = world.createRigidBody(desc);
  const collider = world.createCollider(
    RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
      .setDensity(1.0)
      ,
    rigidBody.value.handle
  );

  // 同步位置和旋转
  world.timestep(1/60);
  world.step();
  world.synchronizeData();
}

const updatePhysics = () => {
  world.step();
  world.synchronizeData();
  if (rigidBody.value) {
    const pos = rigidBody.value.translation();
    cubeMesh.position.set(pos.x, pos.y, pos.z);
    const rot = rigidBody.value.rotation();
    cubeMesh.quaternion.set(
      rot.x,
      rot.y,
      rot.z,
      rot.w
    );
  }
}

// 重置场景
const resetSimulation = () => {
  world.clear();
  rigidBody.value = null;
  createRigidBody();
}

// 监听参数变化
watch([selectedType, position], () => {
  resetSimulation();
}, { deep: true })
</script>

<style scoped lang="scss">
/* 样式保持不变 */
.docs-container {
  display: flex;
  max-width: 1400px;
  margin: 2rem auto;
  padding: 0 1rem;

  .left-panel {
    width: 40%;
    padding-right: 2rem;

    .CodeBlock {
      border: 1px solid #e1e4e8;
      border-radius: 6px;
      padding: 1rem;
      margin: 1rem 0;
      background: #2d2d2d;
      color: #ffffff;
      font-family: 'Consolas', monospace;
    }

    .control-panel {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 6px;

      input, select {
        margin: 0.5rem;
        padding: 0.3rem;
        font-size: 0.9rem;
      }
    }
  }

  .right-panel {
    width: 60%;
    .three-container {
      width: 100%;
      height: 600px;
      background: #f0f0f0;
    }
  }
}
</style>
