import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import boneStore from '@/store/bone/index.ts';
import {STLLoader} from 'three/addons/loaders/STLLoader.js';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const fbx_loader = new FBXLoader()
const stl_loader = new STLLoader()
const gLtf_loader = new GLTFLoader();

// const lookAt = {x: 0, y: 100, z: 0}
const lookAt = {x: 10, y: 500, z: 10}
const bone = boneStore()
export default class boneThreeView {
    constructor(canvas) {
        this.canvas = canvas // canvas
        this.sizes = {} // 窗口大小
        this.camera = null // 摄像头
        this.renderer = null // 渲染器
        this.JointArray = {} // 关节数组
        this.rootModel = null // 根模型
        this.scene = new THREE.Scene(); // 场景
        this.clock = new THREE.Clock(); // 时间
        this.previousTime = 0; // 上次时间
        this.initWindowSizes() // 初始化窗口大小
        this.initCamera() // 初始化摄像头
        this.initScene() // 初始化场景
        this.inLights() // 初始化灯光
        this.initHelper() // 初始化辅助线
        this.initControls() // 初始化控制器
        // this.initRobot() // 初始化机器人
        this.initRenderer() // 初始化渲染器
        this.initAnimateTick() // 初始化动画
    }

    /*
    * 初始化窗口大小
     */
    initWindowSizes() {
        const sizes = {
            width: this.canvas.parentNode.clientWidth,
            height: this.canvas.parentNode.clientHeight,
        };
        window.addEventListener("resize", () => {
            // Update sizes
            sizes.width = this.canvas.parentNode.clientWidth;
            sizes.height = this.canvas.parentNode.clientHeight;

            // Update camera
            this.camera.aspect = sizes.width / sizes.height;
            this.camera.updateProjectionMatrix();

            // Update renderer
            this.renderer.setSize(sizes.width, sizes.height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });

        this.sizes = sizes;
    }

    /*
    * 初始化场景
     */
    initScene() {
        // this.scene.background = new THREE.Color(0x72645b);
        this.scene.fog = new THREE.Fog(0x073149, 2, 8000);
    }

    /*
    * 初始化摄像头
     */
    initCamera() {
        const camera = new THREE.PerspectiveCamera(40, this.sizes.width / this.sizes.height, 0.25, 10000);
        camera.position.set(-1300, 1100, 1200);
        this.scene.add(camera);
        this.camera = camera;
    }

    /*
    * 初始化灯光
     */
    addShadowedLight(x, y, z, color, intensity) {
        const directionalLight = new THREE.DirectionalLight(color, intensity);
    }

    /**
     * 初始化灯光
     */
    inLights() {
        const addShadowedLight = (x, y, z, color, intensity) => {
            // 半球光，降低强度
            const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 1.5);
            hemiLight.position.set(0, 20, 0);
            this.scene.add(hemiLight);

            // 平行光，降低强度
            const dirLight = new THREE.DirectionalLight(0xffffff, 1);
            dirLight.position.set(3, 10, 10);
            dirLight.castShadow = true;
            dirLight.shadow.camera.top = 2;
            dirLight.shadow.camera.bottom = -2;
            dirLight.shadow.camera.left = -2;
            dirLight.shadow.camera.right = 2;
            dirLight.shadow.camera.near = 0.1;
            dirLight.shadow.camera.far = 40;
            this.scene.add(dirLight);
        }

        // 半球光，降低强度
        this.scene.add(new THREE.HemisphereLight(0x8d7c7c, 0x494966, 1));
        addShadowedLight(500, 500, 500, 0xffffff, 1);
        addShadowedLight(1000, 1000, 800, 0xffd500, 1);
    }
    /**
     * 初始化辅助线
     */
    initHelper() {
        const axes = new THREE.AxesHelper(2000);
        this.scene.add(axes);
        const gridHelper = new THREE.GridHelper(50000, 100);
        this.scene.add(gridHelper);
    }

    /**
     * 初始化控制器
     */
    initControls() {
        const controls = new OrbitControls(this.camera, this.canvas);
        controls.target.set(lookAt.x, lookAt.y, lookAt.z);
        // controls.enableDamping = false;
        controls.enablePan = false;
        // controls.enableZoom = false;
        this.controls = controls;
    }

    /**
     * 设置控制器是否可用
     * @param enabled
     */
    setControlsEnabled(enabled) {
        this.controls.enabled = enabled
    }
    /**
     * 初始化机器人
     * @returns {Promise<void>}
     */
    initRobot = async () => {
        this.JointArray = {} // 关节数组
        if (this.rootModel) { // 删除根模型
            this.scene.remove(this.rootModel);
        }
        const loader = new STLLoader(); // 加载模型
        const glassMaterial = new THREE.MeshPhongMaterial({ // 透明材质
            color: '#3d79ff',
            transparent: true,
            opacity: 0.4,
            shininess: 4,
        })
        // 网格材质
        const material = new THREE.MeshPhongMaterial({color: 0xff9c7c, specular: 0x494949, shininess: 200});
        /**
         * 设置关节
         * @param size 关节大小-默认为5
         * @param position 关节位置-默认0,0,0.位置为相对关节位置
         * @returns {Mesh<SphereGeometry, MeshPhongMaterial>}
         */
        let setJoint = (size, position) => {
            let _position = position || {x: 0, y: 0, z: 0}
            let _size = size || 5
            const SphereGeometry = new THREE.SphereGeometry(_size)
            const joint = new THREE.Mesh(SphereGeometry, glassMaterial);
            joint.position.set(_position['x'], _position['y'], _position['z']);
            return joint
        }
        /**
         * 加载模型
         * @param name
         * @param position
         * @returns {Promise<unknown>}
         */
        let loadingModel = (name, position, size = 0) => {
            return new Promise(((resolve, reject) => {
                let _position = position || {x: -.25, y: 0, z: -.25};
                let _name = name || ''
                loader.load(`/boneView/woman/${_name}`, (geometry) => {
                // loader.load(`https://file.qupuba.com/new_human/boneView/woman/${_name}`, (geometry) => {
                    let Mesh = new THREE.Mesh(geometry, material);
                    Mesh.position.set(_position.x, _position.y, _position.z);
                    Mesh.castShadow = true;
                    size>0 ? Mesh.scale.set(size, size, size) : null;
                    resolve(Mesh)
                });

            }))
        }
        let modelArr = {}
        let boneList = bone.getBoneList || [] //获取所有骨骼列表
        let modelNum = boneList.length
        // 设置场景
        let setScenes = async () => {
            for (let key in modelArr) {
                let item = modelArr[key]
                let model = item.model
                let info = item.info
                if (info.parent * 1 === 0) {
                    this.rootModel = model
                    this.scene.add(this.rootModel);
                } else {
                    modelArr[info.parent].model.add(model);
                    if (info.field === 'D') { //显示轴线
                        const axes = new THREE.AxesHelper(2000);
                        // model.add(axes);
                    }
                }
                if (info.master_slave * 1 === 0) {
                    // this.JointArray[info.field] = model
                    this.JointArray[info.id] = item
                }
            }
            bone.JointArray = this.JointArray
        }
        // 初始化所有模型
        let initAllModel = async (item) => {
            let model // 设置模型变量
            if (+item.model_type === 1) { //主动的设为关节,不管有没有模型
                model = setJoint(item['size'] || 10, item['position']); // 设置关节
            } else { //被动的设为模型
                if (item['model_name']) { // 有名字就加载模型,没名字代表隐藏的
                    model = await loadingModel(item['model_name'], item['position'], item['size'])
                }
            }
            modelArr[item.id] = {
                model: model,
                info: item
            }
            modelNum--
            if (modelNum === 0) {
                setScenes()
            }
        }
        boneList.map((item) => {
            initAllModel(item)
        })
    }

    /**
     * 设置机器人旋转
     * @param rotation
     * @param name
     * @param direction
     */
    setRobotRotation(rotation, name, direction) {
        this.JointArray[name]['model'].rotation[direction] = rotation

        // this.JointArray[name]['model'][`rotate${direction.toUpperCase()}`](rotation)
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true, //开启锯齿
            alpha: true,
            canvas: this.canvas,
        });
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.useLegacyLights = false;
        this.renderer.shadowMap.enabled = true;
    }

    initAnimateTick() {
        const elapsedTime = this.clock.getElapsedTime();
        const deltaTime = elapsedTime - this.previousTime;
        this.previousTime = elapsedTime;
        //Update controls
        // this.controls.update();
        // Render
        this.renderer.render(this.scene, this.camera);
        this.camera.lookAt(lookAt.x, lookAt.y, lookAt.z);

        // Call tick again on the next frame
        window.requestAnimationFrame(() => {
            this.initAnimateTick()
        });
    }
}
