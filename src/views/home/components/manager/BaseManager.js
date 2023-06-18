// 文件路径：src/views/home/components/Robot3d/manager/BaseManager.js

import * as dat from "dat.gui";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {STLLoader} from 'three/addons/loaders/STLLoader';
// const files = import.meta.glob('/human'); // 自定义规则
// const files = import.meta.glob('/src/assets/human/*.STL'); // 自定义规则
export default class baseManager {
    constructor(canvas) {
        //Gui
        this.fullSize = 0.01
        this.gui      = new dat.GUI();
        this.gui.hide();
        //Canvas
        this.canvas   = canvas
        //Sizes
        this.sizes    = {}
        //Camera
        this.camera   = null
        //Renderer
        this.renderer = null
        // Scene
        this.scene    = new THREE.Scene();

        //AnimateTick
        this.clock        = new THREE.Clock();
        this.previousTime = 0;

        this.initWindowSizes()
        this.initcamera()
        this.inLights()
        this.initHelper()
        this.initControls()
        this.initRobot()
        this.initRenderer()
        this.initAnimateTick()
    }

    /**
     * Sizes
     */
    initWindowSizes() {
        /**
         * Sizes
         */
        const sizes = {
            width : this.canvas.parentNode.clientWidth,
            height: this.canvas.parentNode.clientHeight,
        };

        window.addEventListener("resize", () => {
            // Update sizes
            sizes.width        = this.canvas.parentNode.clientWidth;
            sizes.height       = this.canvas.parentNode.clientHeight;
            // Update camera
            this.camera.aspect = sizes.width / sizes.height;
            this.camera.updateProjectionMatrix();

            // Update renderer
            this.renderer.setSize(sizes.width, sizes.height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });

        this.sizes = sizes;
    }

    /**
     * Camera
     */
    initcamera() {
        this.scene.background = new THREE.Color(0x72645b);
        this.scene.fog        = new THREE.Fog(0x72645b, 2, 10000);
        const plane           = new THREE.Mesh(
            new THREE.PlaneGeometry(40000, 40000),
            new THREE.MeshPhongMaterial({color: 0xcbcbcb, specular: 0x474747})
        );
        plane.rotation.x      = -Math.PI / 2;
        plane.position.y      = -.5;
        this.scene.add(plane);
        plane.receiveShadow = true;

        // Base camera
        const camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 10000);
        camera.position.set(1500, 1500, 10);
        this.scene.add(camera);
        this.camera = camera;
    }

    /**
     * inLights
     */
    inLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);

        const directionalLight      = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.set(1024, 1024);
        directionalLight.shadow.camera.far    = 25;
        directionalLight.shadow.camera.left   = -7;
        directionalLight.shadow.camera.top    = 7;
        directionalLight.shadow.camera.right  = 7;
        directionalLight.shadow.camera.bottom = -7;
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
    }

    /**
     * Helper
     */
    initHelper() {
        // const axes = new THREE.AxesHelper(100);
        // this.scene.add(axes);

        // const gridHelper = new THREE.GridHelper(50000, 100);
        // this.scene.add(gridHelper);
    }

    /**
     * Controls
     */
    initControls() {
        const controls = new OrbitControls(this.camera, this.canvas);
        controls.target.set(0, 0.75, 0);
        controls.enableDamping = true;
        this.controls          = controls;
    }

    // 设置控制功能
    setControlsEnabled(enabled) {
        this.controls.enabled = enabled
    }

    /**
     * Robot
     * async
     * await
     */
    initRobot = async () => {
        // console.log('files---', files)
        // console.log(path.join(__dirname, 'src'))
        // console.log(path.join(__dirname, dir))
        const loader           = new STLLoader();
        const sphereMesh       = new THREE.MeshPhongMaterial({color: "#67C23A", specular: 0x494949, shininess: 200})
        const glassMaterial    = new THREE.MeshPhongMaterial({color: '#3d79ff', transparent: true, opacity: 0.4, shininess: 4,})
        const SphereGeometry   = new THREE.SphereGeometry(0.5)
        const SphereGeometry_d = new THREE.SphereGeometry(.5)
        const boxMesh          = new THREE.MeshPhongMaterial({color: "#E45826", specular: 0x494949, shininess: 200})
        const material         = new THREE.MeshPhongMaterial({color: 0xff9c7c, specular: 0x494949, shininess: 200});

        let setJoint     = (position) => {
            const joint = new THREE.Mesh(SphereGeometry, glassMaterial);
            joint.position.set(position.x, position.y, position.z);
            return joint
        }
        let loadingModel = (name, position, rotation, scale) => {
            return new Promise(((resolve, reject) => {
                let _position = position || {x: -.25, y: 0, z: -.25}
                let _rotation = rotation || {x: 0, y: 0, z: 0}
                // let _scale    = scale || {x: .01, y: .01, z: .01}
                loader.load(`/src/assets/human/${name}.STL`, (geometry) => {
                    let Mesh = new THREE.Mesh(geometry, material);
                    Mesh.position.set(_position.x, _position.y, _position.z);
                    Mesh.rotation.set(_rotation.x, _rotation.y, _rotation.z);
                    Mesh.castShadow = true;

                    // Mesh.scale.set(_scale.x, _scale.y, _scale.z);
                    resolve(Mesh)
                    // resolve (setJoint(Mesh))
                });
            }))
        }
        let bone = await loadingModel('bone-2', );
        let Pelvis_V1_frame = await loadingModel('Pelvis_V1_frame', );
        let D1 = await loadingModel('bone-2', );
        // const D1         = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, .5), boxMesh);
        let D2 = setJoint({x: .25, y: 4, z: .25})
        D1.add(D2);
        let B1 = await loadingModel('demo', );
        D2.add(B1);
        let D3 = setJoint({x: .25, y: 4, z: .25})
        B1.add(D3);
        let B2 = await loadingModel('demo', );
        D3.add(B2);
        let D4 = setJoint({x: .25, y: 4, z: .25,})
        B2.add(D4);
        let B3 = await loadingModel('demo', );
        D4.add(B3);
        let D5 = setJoint({x: .25, y: 4, z: .25})
        B3.add(D5);
        let B4 = await loadingModel('demo');
        D5.add(B4);

        this.scene.add(D1);
        // this.scene.add(B3);
        // this.scene.add(B4);
        this.scene.add(bone);
        this.scene.add(Pelvis_V1_frame);
        this.D1 = D1
        this.D2 = D2
        this.D3 = D3
        this.D4 = D4
        this.D5 = D5

    }

    // 设置机器人旋转
    setRobotRotation(rotation, name, direction) {
        this[name].rotation[direction] = rotation
    }

    /**
     * Renderer
     */
    initRenderer() {
        this.renderer                   = new THREE.WebGLRenderer({
            canvas: this.canvas,
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        // this.renderer.setClearColor(#);
    }

    /**
     * AnimateTick
     */
    initAnimateTick() {
        const elapsedTime = this.clock.getElapsedTime();
        const deltaTime   = elapsedTime - this.previousTime;
        this.previousTime = elapsedTime;

        //Update controls
        this.controls.update();

        // Render
        this.renderer.render(this.scene, this.camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(() => {
            this.initAnimateTick()
        });
    }
}
