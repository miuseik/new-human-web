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

let gui, scene, camera, renderer, orbit, lights, mesh, bones, skeletonHelper;

const state = {
  animateBones: false
};

function initScene() {
  gui = new GUI();
  scene = new Scene();
  scene.background = new Color(0x444444);

  camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.z = 30;
  camera.position.y = 30;

  renderer = new WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableZoom = false;

  lights = [];
  lights[0] = new PointLight(0xffffff, 1, 0);
  lights[1] = new PointLight(0xffffff, 1, 0);
  lights[2] = new PointLight(0xffffff, 1, 0);

  lights[0].position.set(0, 200, 0);
  lights[1].position.set(100, 200, 100);
  lights[2].position.set(-100, -200, -100);

  scene.add(lights[0]);
  scene.add(lights[1]);
  scene.add(lights[2]);

  window.addEventListener('resize', function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

  }, false);

  initBones();
  setupDatGui();

}

function createGeometry(sizing) {

  const geometry = new CylinderGeometry(
      5, // 顶部圆柱体的半径
      6, // 底部圆柱体的半径
      sizing.height, // 圆柱体的高度
      10, // 圆柱周围的分段面数
      sizing.segmentCount * 3, // 沿圆柱体高度的面的行数
      true // 圆柱体的末端是打开
  );

  const position = geometry.attributes.position; //圆柱体顶点位置集合

  const vertex = new Vector3(); //创建一个三维向量用于保存顶点坐标

  const skinIndices = []; //顶点索引聚合
  const skinWeights = []; //顶点权重聚合

  //遍历几何体所有的顶点
  //遍历顶点
  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i);//依次取出每个点
    const y = (vertex.y + sizing.halfHeight); //y保存相对于圆柱体底面的高度值。
    const skinIndex = Math.floor(y / sizing.segmentHeight); //高度除以总高度在向下取整，得到当前的skinIndex
    const skinWeight = (y % sizing.segmentHeight) / sizing.segmentHeight; //当前的y值占该段的百分比
    skinIndices.push(skinIndex, skinIndex + 1, 0, 0); //该点关联bone[skinIndex]和bone[skinIndex+1]
    skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
    //关联bone[skinIndex]的比重为1 - skinWeight，关联bone[skinIndex+1]的比重为skinWeight。
    //举个例子，第一个y值刚好为0。那么skinIndex为0，skinWeight也为0。所以呢该点相关的骨骼索引为0和1，权重分别是1和0，也就是该点只与bone[0]有关。
    //再比如y值为4，那么skinIndex为0，skinWeight也为0.5，所以呢该点相关的骨骼索引为0和1，权重分别是0.5和0.5，也就是该点与bone[0]和bone[1]都相关。其实也很容易理解，因为4恰好在该分段的中间，所以决定于两个骨骼点的状态。
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

function setupDatGui() {
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

function initBones() {

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

  requestAnimationFrame(render);

  const time = Date.now() * 0.001;

  //Wiggle the bones
  if (state.animateBones) {

    for (let i = 0; i < mesh.skeleton.bones.length; i++) {

      mesh.skeleton.bones[i].rotation.z = Math.sin(time) * 2 / mesh.skeleton.bones.length;

    }

  }

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
