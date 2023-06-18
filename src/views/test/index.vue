<template>
  <div id="my_three"> </div>
</template>
<script setup lang='ts' name="test">
// import * as THREE from "three"; /* three.js的module */
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
// import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
//
// var scene, camera, renderer, orbitControls;
// const objects = []; /* 模型数组 */
//
// initScene();
// createGeometry();
// createDragControls(objects);
//
// function initScene() {
//   /* 构建场景 */
//   scene = new THREE.Scene();
//
//   /* 构建一个坐标系 */
//   var axisHelper = new THREE.AxesHelper(1000);
//   scene.add(axisHelper);
//
//   /* 构建环境光, 环境光不能用来投射阴影，因为它没有方向 */
//   // var ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
//   // scene.add(ambientLight);
//
//   /* 构建点光源，可以有明暗变化 */
//   var pointLight = new THREE.PointLight(0xffffff);
//   pointLight.position.set(400, 200, 300); //点光源位置
//   scene.add(pointLight); //点光源添加到场景中
//
//   /* 构建相机 */
//   var width = window.innerWidth; // 窗口宽度
//   var height = window.innerHeight; // 窗口高度
//   var k = width / height; // 窗口宽高比
//   var s = 200; // 三维场景显示范围控制系数，系数越大，显示的范围越大
//   camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
//   camera.position.set(200, 300, 200); // 设置相机位置
//   camera.lookAt(scene.position); // 设置相机方向(指向的场景对象)
//
//   /* 构建渲染器 */
//   renderer = new THREE.WebGLRenderer();
//   renderer.setSize(width, height); // 设置渲染区域尺寸
//   renderer.setClearColor(0xb9d3ff, 1); // 设置背景颜色
//   document.body.appendChild(renderer.domElement); // body元素中插入canvas对象
//
//   orbitControls = new OrbitControls(camera, renderer.domElement);
//   orbitControls.update();
// }
//
// function createGeometry() {
//   /* 构建正方体几何对象添加到场景中 */
//   var boxGeometry = new THREE.BoxGeometry(100, 100, 100); // 创建一个正方体几何对象
//   var materialBox = new THREE.MeshLambertMaterial({
//     color: 0x0000ff,
//     opacity: 1,
//     transparent: true
//   }); // 材质对象Material
//   var meshBox = new THREE.Mesh(boxGeometry, materialBox); // 网格模型对象Mesh
//   meshBox.name = "box";
//   scene.add(meshBox); // 网格模型添加到场景中，未设定x/y/z坐标，默认位于坐标轴原点
//   objects.push(meshBox);
//
//   /* 圆柱体几何对象添加到场景中 */
//   var cylinder = new THREE.CylinderGeometry(50, 50, 200, 25);
//   var materialCylinder = new THREE.MeshLambertMaterial({
//     color: 0xd0021b,
//     opacity: 1,
//     transparent: true
//   }); // 材质对象Material
//   var meshCylinder = new THREE.Mesh(cylinder, materialCylinder); // 网格模型对象Mesh
//   meshCylinder.name = "cylinder"; /* 标识符 */
//   scene.add(meshCylinder);
//   objects.push(meshCylinder);
// }
//
// function createDragControls(objects) {
//   // 初始化拖拽控件
//   var dragControls = new DragControls(objects, camera, renderer.domElement);
//
//   // 鼠标略过事件
//   dragControls.addEventListener('hoveron', function (event) {
//     console.log("createDragControls hoveron");
//     // 让变换控件对象和选中的对象绑定
//   });
//
//   // 开始拖拽
//   dragControls.addEventListener('dragstart', function (event) {
//     console.log("createDragControls dragstart");
//     orbitControls.enabled = false;
//   });
//
//   // 拖拽过程
//   dragControls.addEventListener('drag', function (event) {
//     console.log("createDragControls drag");
//     dragControlsRender();
//   });
//
//   // 拖拽结束
//   dragControls.addEventListener('dragend', function (event) {
//     console.log("createDragControls dragend");
//     orbitControls.enabled = true;
//   });
// }
//
// function dragControlsRender() {
//   renderer.render(scene, camera);
// }
//
// function render() {
//   orbitControls.update();
//   /* 执行渲染 */
//   requestAnimationFrame(render);
//   renderer.render(scene, camera); //执行渲染操作，指定场景、相机作为参数
// }
// render();
</script>
