import * as THREE from "three";
import * as IndexBg from "@/assets/img/background/index.js";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let container;
// let stats;
let cameraControls;

let camera, scene, renderer;
let mouseX = 0, mouseY = 0;
let threeDocument;
let domWidth;
let domHeight;

function init() {
    threeDocument = document.getElementById("my_three");
    domWidth  = window.innerWidth;
    domHeight = threeDocument.offsetHeight;

    container = threeDocument;
    camera    = new THREE.PerspectiveCamera(20, domWidth / domHeight, 1, 10000);
    // camera    = new THREE.OrthographicCamera(SCREEN_WIDTH / -10, SCREEN_WIDTH / 10, SCREEN_HEIGHT / 10, SCREEN_HEIGHT / -10, 1, 2000);
    // camera    = new THREE.PerspectiveCamera(35, 1920 / 1080, 1, 2000);

    // camera            = new THREE.PerspectiveCamera(20, domWidth / domHeight, 1, 10000);
    camera.position.z = 1800;
    //创建一个三维场景
    scene             = new THREE.Scene();
    // scene.background = new THREE.Color( 0xE1FFFF);// 场景背景
    // scene.fog = new THREE.Fog( 0xE1FFFF, 200, 1000 ); // 场景雾化

    const light = new THREE.DirectionalLight(0x0c0c0c);
    light.position.set(0, 0, 1);
    scene.add(light);
//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    createImg(IndexBg.starC, {scale: {x: 500, y: 500, z: 0}, position: {x: -20, y: 100, z: 100}});
    createImg(IndexBg.starM, {scale: {x: 1200, y: 800, z: 0}, position: {x: 1000, y: 150, z: -1150}});
    createImg(IndexBg.earth, {scale: {x: 1500, y: 875, z: 0}, position: {x: 0, y: 0, z: -100}});
    createImg(IndexBg.starE, {scale: {x: 250, y: 250, z: 0}, position: {x: 380, y: 130, z: -100}});
    createImg(IndexBg.starB, {scale: {x: 1000, y: 300, z: 0}, position: {x: -150, y: 150, z: -1000}});
    createImg(IndexBg.star1, {scale: {x: 400, y: 100, z: 0}, position: {x: 1700, y: 600, z: -900}});
    createImg(IndexBg.star2, {scale: {x: 100, y: 100, z: 0}, position: {x: -450, y: -150, z: -800}});
    createImg(IndexBg.star3, {scale: {x: 500, y: 500, z: 0}, position: {x: 1150, y: -150, z: -100}});
    createImg(IndexBg.star4, {scale: {x: 700, y: 200, z: 0}, position: {x: -350, y: 350, z: -500}});
    createImg(IndexBg.star5, {scale: {x: 50, y: 50, z: 0}, position: {x: 50, y: -150, z: 0}});
//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(domWidth, domHeight);//设置渲染区尺寸
    container.appendChild(renderer.domElement);
    ///
    ///
    // 设置相机控件轨道控制器OrbitControls
    ///
    ///
    document.addEventListener("mousemove", onDocumentMouseMove);
    document.addEventListener( "touchmove",function (e){
        let touch = e['changedTouches'][0]
        onDocumentMouseMove(touch)
    });
    // document.addEventListener("change", onDocumentMouseMove);
    window.addEventListener("resize", onWindowResize);
}
function createImg(img, option) {
    let texture        = new THREE.TextureLoader().load(img);
    let SpriteMaterial = new THREE.SpriteMaterial({
        map        : texture,
        transparent: true,//开启透明(纹理图片png有透明信息)
    });
    // 创建精灵
    let sprite         = new THREE.Sprite(SpriteMaterial);
    // 大小
    sprite.scale.set(option.scale.x, option.scale.y, option.scale.z);
    // 所在位置
    sprite.position.set(option.position.x, option.position.y, option.position.z);
    scene.add(sprite);
}

function onWindowResize() {
    domWidth      = window.innerWidth;
    domHeight     = threeDocument.offsetHeight;
    camera.aspect = domWidth / domHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(domWidth, domHeight);
}

function onDocumentMouseMove(event) {
    mouseX = Math.trunc((event.clientX - domWidth / 2)*-1);
    mouseY =Math.trunc((event.clientY - domHeight / 2)*-1)
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    let _X = camera.position.x;
    let _Y = camera.position.y;

    camera.position.x += (mouseX - _X) * 0.5;
    camera.position.y += (-mouseY - _Y) * 0.5;
    //设置相机方向
    camera.lookAt(0, 0, 0);
    //执行渲染操作、指定场景、相机作为参数
    renderer.render(scene, camera);
}

export default function () {
    let initThree = () => {
        init();
        animate();
    };
    // 暴露出去
    return {
        initThree,
    };
}

