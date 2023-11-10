<template>
  <button @click="startThree()" class="btn btn-brand">开始</button>
  <button @click="stopThree()" class="btn btn-brand">暂停</button>
  <button @click="resetThree()" class="btn btn-brand">重置</button>
</template>
<script setup lang='ts'>
import * as THREE from "three";
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
// 1,创建场景
var scene = new THREE.Scene();
// 2，创建几何体模型
// 创建球模型
var sphere = new THREE.SphereGeometry(50,100,100);
sphere.translate(0,0,100);
// 创建盒子模型
var box = new THREE.BoxGeometry(50,50,50);

var material = new THREE.MeshBasicMaterial({color:0xffaacc});
var material2 = new THREE.MeshBasicMaterial({color:0xffaacc});
var mesh_sphere = new THREE.Mesh(sphere, material);
var mesh_box = new THREE.Mesh(box, material2);
var group = new THREE.Group();
mesh_sphere.name = "Sphere";
mesh_box.name = "Box";
group.add(mesh_box,mesh_sphere);
scene.add(group);
// 创建关键帧---start
var position_times = [0,10]; // 关键帧中位置变化的时间
var position_values = [0,0,0,150,0,0]; // 关键帧中位置变化的值，三个为一组
// 关键帧轨道 KeyframeTrack( name : String, times : Array, values : Array, interpolation : Constant )
// name – 关键帧轨道(KeyframeTrack)的标识符.轨道的名称可以指动画对象中的变形目标(morph targets)、骨骼(bones)或可能的其他值
// times – 关键帧的时间数组,
// values – 与时间数组中的时间点相关的值组成的数组
var position_track = new THREE.KeyframeTrack("Box.position",position_times,position_values);
var position2_track = new THREE.KeyframeTrack("Box.position",[10,15],[150,0,0,150,50,0,]);
var colors_time = [5,15];
var colors_values = [0,1,0,1,1,0];
var color_track = new THREE.KeyframeTrack("Box.material.color",colors_time,colors_values);
var scale_track = new THREE.KeyframeTrack("Sphere.scale",colors_time,[1, 1, 1   , 1.1, 1.5, 1.5]);
// 动画剪辑 AnimationClip( name : String, duration : Number, tracks : Array )
var clip = new THREE.AnimationClip(
    "defalult", // name – 此剪辑的名称
    20, // 持续时间 (单位秒). 如果传入负数, 持续时间将会从传入的数组中计算得到。
    [position_track,position2_track,color_track,scale_track] // 一个由关键帧轨道（KeyframeTracks）组成的数组。
)
// AnimationMixer 动画混合器是用于场景中特定对象的动画的播放器。
var mixer = new THREE.AnimationMixer(group);
// AnimationActions 用来调度存储在AnimationClips中的动画。
var AnimationAction = mixer.clipAction(clip); // 返回所传入的剪辑参数的AnimationAction
AnimationAction.timeScale = 10; // 时间的比例因子，值为0，会使动画暂停
// AnimationAction.play(); // 让混合器激活动作
// 创建关键帧---end

// 3，创建灯光对象
var ambient = new THREE.AmbientLight(0xffffff);
scene.add(ambient);
// 4,创建相机对象
var width = window.innerWidth- 50;
var height = window.innerHeight - 50;
var k = width / height;
var s = 200;
var camera = new THREE.OrthographicCamera(-s*k,s*k,s,-s,-1000,1000);
camera.position.set(200,300,200);
camera.lookAt(scene.position);
// 5,创建渲染器对象
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width,height);
document.body.appendChild(renderer.domElement);
var clock = new THREE.Clock();
function render(){
  renderer.render(scene,camera);
  requestAnimationFrame(render);
  // 播放关键帧动画时，要执行mixer.update(渲染时间间隔)告诉帧动画系统three.js两次渲染的时间间隔，
  // 获得时间间隔可以通过一个时钟类Clock时间
  mixer.update(clock.getDelta());
}
// 创建轴辅助对象
var axes = new THREE.AxesHelper(500);
scene.add(axes);
// 创建鼠标控制对象
var controls = new OrbitControls(camera,renderer.domElement);
render();

const startThree =()=>{
  AnimationAction.play(); // 让混合器激活动作
}
const stopThree =()=>{
  AnimationAction.stop(); // 让混合器停止动作,动作会马上停止以及完全[page:.reset 重置].
}
const resetThree =()=>{
  AnimationAction.reset(); // 重置动作
}

</script>
<style lang="scss" scoped>
.test {
  width: 100vw;
  height: 100vh;
}
</style>
