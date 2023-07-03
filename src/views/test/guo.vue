<template>
  <button @click="startThree()" class="btn btn-brand">开始</button>
  <button @click="stopThree()" class="btn btn-brand">暂停</button>
  <button @click="resetThree()" class="btn btn-brand">重置</button>
</template>
<script setup lang='ts'>
import * as THREE from "three";
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {STLLoader} from 'three/addons/loaders/STLLoader';

const loader = new STLLoader();

// 1,创建场景
var scene = new THREE.Scene();

let initScene =()=> {
  scene.background = new THREE.Color(0x72645b);
  scene.fog        = new THREE.Fog(0x72645b, 2, 10000);
  const plane           = new THREE.Mesh(
      new THREE.PlaneGeometry(40000, 40000),
      new THREE.MeshPhongMaterial({color: 0xcbcbcb, specular: 0x474747})
  );
  plane.rotation.x      = -Math.PI / 2;
  plane.position.y      = -.5;
  scene.add(plane);
  plane.receiveShadow = true;
}
initScene()
var camera
var width = window.innerWidth;
var height = window.innerHeight;
let initCamera =()=> {
// 4,创建相机对象
  var k = width / height;
  var s = 200;
  camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 10000);
  camera.position.set(1500, 1500, 1500);
  camera.lookAt(scene.position);
}
initCamera()
let inLights =()=> {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
  const directionalLight      = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.shadow.camera.far    = 25;
  directionalLight.shadow.camera.left   = -7;
  directionalLight.shadow.camera.top    = 7;
  directionalLight.shadow.camera.right  = 7;
  directionalLight.shadow.camera.bottom = -7;
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);
}
inLights()
// 2，创建几何体模型
// 创建球模型
const material = new THREE.MeshPhongMaterial({
  color    : 0xff9c7c,
  specular : 0x494949,
  shininess: 200
});
let loadingModel = () => {
  return new Promise(((resolve, reject) => {
    let _position = {
      x: -.25,
      y: 0,
      z: -.25
    }
    let _rotation = {
      x: 0,
      y: 0,
      z: 0
    }
    loader.load(`/src/assets/human/HumanSkeleton2022.STL`, (geometry) => {
      let Mesh = new THREE.Mesh(geometry, material);
      Mesh.position.set(_position.x, _position.y, _position.z);
      Mesh.rotation.set(_rotation.x, _rotation.y, _rotation.z);
      Mesh.castShadow = true;
      // Mesh.scale.set(_scale.x, _scale.y, _scale.z);
      resolve(Mesh)
    });
  }))
}
let initAllModel = async () => {
  let model = await loadingModel();
  scene.add(model)
}
initAllModel()

var Bone1 = new THREE.Bone(); //关节1，用来作为根关节
var Bone2 = new THREE.Bone(); //关节2
var Bone3 = new THREE.Bone(); //关节3

// 设置关节父子关系   多个骨头关节构成一个树结构
Bone1.add(Bone2);
Bone2.add(Bone3);
// 设置关节之间的相对位置
//根关节Bone1默认位置是(0,0,0)
Bone2.position.y = 60; //Bone2相对父对象Bone1位置
Bone3.position.y = 40; //Bone3相对父对象Bone2位置

// 所有Bone对象插入到Skeleton中，全部设置为.bones属性的元素
var skeleton = new THREE.Skeleton([Bone1, Bone2, Bone3]); //创建骨骼系统
// 查看.bones属性中所有骨关节Bone
console.log(skeleton.bones);
// 返回所有关节的世界坐标
skeleton.bones.forEach(elem => {
  console.log(elem.getWorldPosition(new THREE.Vector3()));
});


// 3，创建灯光对象
var ambient = new THREE.AmbientLight(0xffffff);
scene.add(ambient);

// 5,创建渲染器对象
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);


var n = 0;
var T = 50;
var step = 0.01;
// 渲染函数
function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
  n += 1;
  if (n < T) {
    // 改变骨关节角度
    skeleton.bones[0].rotation.x = skeleton.bones[0].rotation.x - step;
    skeleton.bones[1].rotation.x = skeleton.bones[1].rotation.x + step;
    skeleton.bones[2].rotation.x = skeleton.bones[2].rotation.x + 2 * step;
  }
  if (n < 2 * T && n > T) {
    skeleton.bones[0].rotation.x = skeleton.bones[0].rotation.x + step;
    skeleton.bones[1].rotation.x = skeleton.bones[1].rotation.x - step;
    skeleton.bones[2].rotation.x = skeleton.bones[2].rotation.x - 2 * step;
  }
  if (n === 2 * T) {
    n = 0;
  }
}
render()

// 创建轴辅助对象
var axes = new THREE.AxesHelper(500);
scene.add(axes);
// 创建鼠标控制对象
var controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;
render();


</script>
<style lang="scss" scoped>
.test {
  width: 100vw;
  height: 100vh;
}
</style>
