<template>
  <canvas ref="canvas" class="h-full w-full" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watchEffect } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as RAPIER from '@dimforge/rapier3d'

// 核心Three.js初始化
const createThreeScene = (canvas: HTMLCanvasElement) => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
  )
  camera.position.z = 15

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setClearColor(0xf0f0f0)
  renderer.setSize(window.innerWidth, window.innerHeight)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  // 添加环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  // 添加平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 10, 5)
  scene.add(directionalLight)

  return { scene, camera, renderer, controls }
}

// 模型加载（根据你的JSON格式调整）
const createMeshFromJson = (
    scene: THREE.Scene,
    modelData: { vertices: number[], indices: number[] }
) => {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(modelData.vertices), 3)
  )
  geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(modelData.indices), 1))

  const material = new THREE.MeshStandardMaterial({ color: 0x4488ff })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
  return mesh
}

// 物理系统集成（关键修正）
const addPhysicsToMesh = (
    world: RAPIER.World,
    mesh: THREE.Mesh,
    mass: number
) => {
  // 创建动态刚体
  const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(mesh.position.x, mesh.position.y, mesh.position.z)
      .setMass(mass)
  const rigidBody = world.createRigidBody(rigidBodyDesc)

  // 创建三角网格碰撞体（关键！）
  const vertices = mesh.geometry.attributes.position.array
  const indices = mesh.geometry.index.array || new Uint32Array()
  const colliderDesc = RAPIER.ColliderDesc.trimesh(
      new RAPIER.Vector3Array(vertices),
      new RAPIER.Uint32Array(indices)
  )
  world.createCollider(colliderDesc, rigidBody)

  // 创建地面（静态刚体）
  const groundBody = world.createRigidBody(RAPIER.RigidBodyDesc.static())
  world.createCollider(
      RAPIER.ColliderDesc.cuboid(10, 0.5, 10),
      groundBody
  )

  // 添加旋转关节（示例关节）
  world.createImpulseJoint(
      RAPIER.JointData.revolute(
          { x: 0, y: 2, z: 0 }, // 关节中心（模型本地坐标）
          { x: 1, y: 0, z: 0 }  // 旋转轴（X轴）
      ),
      rigidBody,
      groundBody,
      true
  )

  // 位置同步函数
  return () => {
    const pos = rigidBody.translation()
    const rot = rigidBody.rotation()
    mesh.position.set(pos.x, pos.y, pos.z)
    mesh.quaternion.set(rot.x, rot.y, rot.z, rot.w)
  }
}

// 组件逻辑
const canvas = ref<HTMLCanvasElement>()
let three: Awaited<ReturnType<typeof createThreeScene>>
let physicsWorld: RAPIER.World
let physicsSync: () => void

onMounted(async () => {
  if (!canvas.value) return

  // 初始化Three.js
  three = createThreeScene(canvas.value)

  // 加载自定义模型（示例数据，需替换为真实路径）
  const modelData = await fetch('/modelJson/demo.json')
      .then(res => res.json()) as { vertices: number[], indices: number[] }

  // 创建可视化网格
  const mesh = createMeshFromJson(three.scene, modelData)
  mesh.position.y = 5 // 初始高度

  // 初始化物理世界
  physicsWorld = new RAPIER.World({ x: 0, y: -9.81, z: 0 })
  physicsSync = addPhysicsToMesh(physicsWorld, mesh, 3)

  // 动画循环
  let lastFrame = 0
  const animate = (timestamp: number) => {
    requestAnimationFrame(animate)
    const delta = Math.min((timestamp - lastFrame) / 1000, 0.05)
    lastFrame = timestamp

    physicsWorld.step(delta) // 物理模拟
    physicsSync() // 同步位置
    three.controls.update() // 控制器更新
    three.renderer.render(three.scene, three.camera) // 渲染
  }
  requestAnimationFrame(animate)
})

onUnmounted(() => {
  three.renderer.dispose()
  three.controls.dispose()
  physicsWorld.destroy() // 释放物理世界资源
})

// 窗口适配
watchEffect(() => {
  if (three.camera && three.renderer) {
    three.camera.aspect = window.innerWidth / window.innerHeight
    three.camera.updateProjectionMatrix()
    three.renderer.setSize(window.innerWidth, window.innerHeight)
  }
})
</script>

<style scoped>
:root {
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

canvas {
  display: block;
}
</style>
