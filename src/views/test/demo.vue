<template>

</template>
<script setup lang='ts'>
import {
  Bone,
  Color,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  MeshPhongMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SkinnedMesh,
  Skeleton,
  SkeletonHelper,
  Vector3,
  Uint16BufferAttribute,
  WebGLRenderer
} from 'three';

import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import * as THREE from "three";
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import {STLLoader} from 'three/addons/loaders/STLLoader.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';

const fbx_loader = new FBXLoader()
const stl_loader = new STLLoader()
const gltf_loader = new GLTFLoader()
const draco_Loader = new DRACOLoader();

let gui, scene, camera, renderer, orbit, lights, mesh, bones, skeletonHelper;
let model
const OOI = {};

const state = {
  animateBones: false
};
const material         = new THREE.MeshPhongMaterial({color: 0xff9c7c, specular: 0x494949, shininess: 200});
let loadingModel       = () => {
  return new Promise(((resolve, reject) => {
    stl_loader.load(`/src/assets/human/HumanSkeleton2022.STL`, (geometry) => {
      let Mesh = new THREE.Mesh(geometry, material);
      Mesh.castShadow = true;
      // Mesh.scale.set(_scale.x, _scale.y, _scale.z);
      resolve(Mesh)
    });
  }))
}
const initScene = async () => {
  gui = new GUI();
  scene = new Scene();
  scene.background = new Color(0x444444);

  camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.z = 30;
  camera.position.y = 30;

  let initScene = () => {
    scene.background = new THREE.Color(0x72645b);
    scene.fog = new THREE.Fog(0x72645b, 2, 10000);
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(40000, 40000),
        new THREE.MeshPhongMaterial({
          color: 0xcbcbcb,
          specular: 0x474747
        })
    );
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -.5;
    scene.add(plane);
    plane.receiveShadow = true;
  }


  renderer = new WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableZoom = false;

  let inLights = () => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 25;
    directionalLight.shadow.camera.left = -7;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = -7;
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
  }
  initScene()
  inLights()
  window.addEventListener('resize', function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

  }, false);
  // model = await loadingModel();

  // const dracoLoader = new DRACOLoader();
  // dracoLoader.setDecoderPath('jsm/libs/draco/');
  // const gltfLoader = new GLTFLoader();
  // gltfLoader.setDRACOLoader(dracoLoader);
  // loader.load(`/src/assets/human/HumanSkeleton2022.STL`, (geometry) => {
  model = await loadingModel();
  draco_Loader.setDecoderPath('three/examples/jsm/libs/draco/');
  gltf_loader.setDRACOLoader(draco_Loader);
  gltf_loader.load('src/assets/gltf/HumanSkeleton2022.glb', function (gltf) {
    // gltf.scene.traverse(n => {
    //   if (n.name === 'head') OOI['head'] = n;
    //   if (n.name === 'lowerarm_l') OOI['lowerarm_l'] = n;
    //   if (n.name === 'Upperarm_l') OOI['Upperarm_l'] = n;
    //   if (n.name === 'hand_l') OOI['hand_l'] = n;
    //   if (n.name === 'target_hand_l') OOI['target_hand_l'] = n;
    //   if (n.name === 'boule') OOI['sphere'] = n;
    //   if (n.name === 'Kira_Shirt_left') OOI['kira'] = n;
    // });
    scene.add(gltf.scene);
    scene.add(model);
  });

  // initBones();
  // setupDatGui();

}

const createGeometry = (sizing) => {
  // const geometry  = model
  const geometry = new CylinderGeometry(
      5, // 顶部圆柱体的半径
      6, // 底部圆柱体的半径
      sizing.height, // 圆柱体的高度
      10, // 圆柱周围的分段面数
      sizing.segmentCount * 3, // 沿圆柱体高度的面的行数
      true // 圆柱体的末端是打开
  );
  // console.log('--', model)
  // console.log('--', geometry)
  const position = geometry.attributes.position; //圆柱体顶点位置集合

  const vertex = new Vector3(); //创建一个三维向量用于保存顶点坐标

  const skinIndices = []; //顶点索引聚合
  const skinWeights = []; //顶点权重聚合
  console.log(position)
  //遍历几何体所有的顶点
  //遍历顶点
  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i);//依次取出每个点
    // console.log(vertex)
    // const y = (vertex.y + sizing.halfHeight); //y保存相对于圆柱体底面的高度值。
    // const skinIndex = Math.floor(y / sizing.segmentHeight); //高度除以总高度在向下取整，得到当前的skinIndex
    // const skinWeight = (y % sizing.segmentHeight) / sizing.segmentHeight; //当前的y值占该段的百分比
    // skinIndices.push(skinIndex, skinIndex + 1, 0, 0); //该点关联bone[skinIndex]和bone[skinIndex+1]
    // skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
    //关联bone[skinIndex]的比重为1 - skinWeight，关联bone[skinIndex+1]的比重为skinWeight。
    //举个例子，第一个y值刚好为0。那么skinIndex为0，skinWeight也为0。所以呢该点相关的骨骼索引为0和1，权重分别是1和0，也就是该点只与bone[0]有关。
    //再比如y值为4，那么skinIndex为0，skinWeight也为0.5，所以呢该点相关的骨骼索引为0和1，权重分别是0.5和0.5，也就是该点与bone[0]和bone[1]都相关。其实也很容易理解，因为4恰好在该分段的中间，所以决定于两个骨骼点的状态。
    // if(vertex.z > 4.3 && vertex.y >= 0) {
    //   skinIndices.push(9,0,0,0);
    //   skinWeights.push(1,0,0,0);
    // } else if (vertex.z < -4.3 && vertex.y >= 0) {
    //   skinIndices.push(10,0,0,0);
    //   skinWeights.push(1,0,0,0);
    // } else if (vertex.z > 4.3 && vertex.y < 0) {
    //   skinIndices.push(11,0,0,0);
    //   skinWeights.push(1,0,0,0);
    // } else if (vertex.z < -4.3 && vertex.y < 0) {
    //   skinIndices.push(12,0,0,0);
    //   skinWeights.push(1,0,0,0);
    // } else if (vertex.y <= 5 && vertex.y >= -5) {
    //   let w = (vertex.y + 5) / 10;
    //   skinIndices.push(0,2,0,0);
    //   skinWeights.push(Math.sqrt(w),1-Math.sqrt(w),0,0);
    // } else if (vertex.y > 5) {
    //   skinIndices.push(1,0,0,0);
    //   skinWeights.push(1,0,0,0);
    // } else if(vertex.y < -5 && vertex.y >= -12 && vertex.z > 0) {
    //   skinIndices.push(3,0,0,0);
    //   skinWeights.push(1,0,0,0);
    // } else if (vertex.y < -12 && vertex.z > 0) {
    //   skinIndices.push(5,0,0,0);
    //   skinWeights.push(1,0,0,0);
    // } else if (vertex.y < -5 && vertex.y >= -12 && vertex.z < 0) {
    //   skinIndices.push(4,0,0,0);
    //   skinWeights.push(1,0,0,0);
    // } else {
    //   skinIndices.push(6,0,0,0);
    //   skinWeights.push(1,0,0,0);
    // }
  }

  geometry.setAttribute('skinIndex', new Uint16BufferAttribute(skinIndices, 4)); //几何体中添加skinIndex属性
  geometry.setAttribute('skinWeight', new Float32BufferAttribute(skinWeights, 4)); //几何体中添加skinWeight属性

  return geometry;

}

function createBones(sizing) {

  bones = []; //骨骼数组

  let prevBone = new Bone(); //根骨骼节点
  bones.push(prevBone); //数组中添加根骨骼节点
  prevBone.position.y = -sizing.halfHeight; //为根骨骼添加位置

  for (let i = 0; i < sizing.segmentCount; i++) {//遍历分段

    const bone = new Bone();//创建骨骼节点
    bone.position.y = sizing.segmentHeight; //为骨骼节点添加本地位置 虽然本地设置的位置都是一样的，但是由于这些骨骼都是父子关系，所以在世界坐标系上位置不同
    bones.push(bone); //数组中继续添加骨骼
    prevBone.add(bone); //根骨骼添加当前骨骼
    prevBone = bone;//再将当前骨骼赋值给根骨骼

  }

  return bones;

}

function createMesh(geometry, bones) {

  const material = new MeshPhongMaterial({
    // skinning: true, //重点
    color      : 0x156289,
    emissive   : 0x072534,
    side       : DoubleSide,
    flatShading: true
  });

  const mesh = new SkinnedMesh(geometry, material); //创建蒙皮网格
  const skeleton = new Skeleton(bones); //创建骨架

  mesh.add(bones[0]); //网格添加根骨骼节点（此例bones[0]为根节点）

  mesh.bind(skeleton); //模型绑定骨架
  skeletonHelper = new SkeletonHelper(mesh); //创建骨骼显示助手
  skeletonHelper.material.linewidth = 2;
  scene.add(skeletonHelper);

  return mesh;

}

const setupDatGui = async () => {
  let folder = gui.addFolder('General Options');
  folder.add(state, 'animateBones');
  folder.controllers[0].name('Animate Bones');
  folder.add(mesh, 'pose');
  folder.controllers[1].name('.pose()');
  const bones = mesh.skeleton.bones;

  for (let i = 0; i < bones.length; i++) {

    const bone = bones[i];

    folder = gui.addFolder('Bone ' + i);

    folder.add(bone.position, 'x', -10 + bone.position.x, 10 + bone.position.x);
    folder.add(bone.position, 'y', -10 + bone.position.y, 10 + bone.position.y);
    folder.add(bone.position, 'z', -10 + bone.position.z, 10 + bone.position.z);

    folder.add(bone.rotation, 'x', -Math.PI * 0.5, Math.PI * 0.5);
    folder.add(bone.rotation, 'y', -Math.PI * 0.5, Math.PI * 0.5);
    folder.add(bone.rotation, 'z', -Math.PI * 0.5, Math.PI * 0.5);

    folder.add(bone.scale, 'x', 0, 2);
    folder.add(bone.scale, 'y', 0, 2);
    folder.add(bone.scale, 'z', 0, 2);

    folder.controllers[0].name('position.x');
    folder.controllers[1].name('position.y');
    folder.controllers[2].name('position.z');

    folder.controllers[3].name('rotation.x');
    folder.controllers[4].name('rotation.y');
    folder.controllers[5].name('rotation.z');

    folder.controllers[6].name('scale.x');
    folder.controllers[7].name('scale.y');
    folder.controllers[8].name('scale.z');

  }

}

const initBones = async () => {

  const segmentHeight = 8; //每一节骨骼的的高度
  const segmentCount = 5; //总节数
  const height = segmentHeight * segmentCount; //总高度
  const halfHeight = height * 0.5; //总高度一半的高度

  const sizing = {
    segmentHeight: segmentHeight,
    segmentCount : segmentCount,
    height       : height,
    halfHeight   : halfHeight
  };

  const geometry = createGeometry(sizing); ///这是生成几何体的方法，主要是根据顶点生成对应的skinIndex和skinWeight属性
  const bones = createBones(sizing); //这是生成骨骼的方法
  mesh = createMesh(geometry, bones); //这是生成蒙皮网格的方法

  mesh.scale.multiplyScalar(1);
  scene.add(mesh);

}

function render() {

  // requestAnimationFrame(render);
  //
  // const time = Date.now() * 0.001;
  //
  // //Wiggle the bones
  // if (state.animateBones) {
  //
  //   for (let i = 0; i < mesh.skeleton.bones.length; i++) {
  //
  //     mesh.skeleton.bones[i].rotation.z = Math.sin(time) * 2 / mesh.skeleton.bones.length;
  //
  //   }
  //
  // }

  renderer.render(scene, camera);

}

initScene();
render();


</script>
<style lang="scss" scoped>
canvas {
  display: block;
  width: 100%;
  height: 100%;
}

#newWindow {
  display: block;
  position: absolute;
  bottom: 0.3em;
  left: 0.5em;
  color: #fff;
}
</style>
