import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// 转换对象型顶点数据为数组
function convertVertices(vertices: Record<number, number>) {
  return Object.values(vertices).flatMap((v, i) => 
    i % 3 === 0 ? [v, vertices[i+1]!, vertices[i+2]!] : []
  ) as number[]
}

// 转换对象型索引数据为数组
function convertIndices(indices: Record<number, number>) {
  return Object.values(indices).filter((_, i) => i % 3 === 0) as number[]
}

export function createThreeScene(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true

  // 环境光+主光源
  scene.add(new THREE.AmbientLight(0x444444, 0.6))
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
  dirLight.position.set(10, 10, 10)
  dirLight.castShadow = true
  scene.add(dirLight)

  camera.position.z = 20
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  return { scene, camera, renderer, controls }
}

export function createMeshFromJson(
  scene: THREE.Scene, 
  data: { vertices: Record<number, number>, indices: Record<number, number> }
) {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(
    new Float32Array(convertVertices(data.vertices)), 
    3
  ))
  geometry.setIndex(new THREE.BufferAttribute(
    new Uint32Array(convertIndices(data.indices)), 
    1
  ))

  const material = new THREE.MeshStandardMaterial({
    color: 0x2b6cb0,
    roughness: 0.7,
    metalness: 0.2
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.scale.set(0.1, 0.1, 0.1) // 调整模型尺寸
  scene.add(mesh)
  return mesh
}
  