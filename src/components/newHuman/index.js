import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {STLLoader} from 'three/addons/loaders/STLLoader';
import boresStore from '@/store/bores/index.ts';

const bores = boresStore()
export default class myThree {
    constructor(canvas) {
        this.canvas       = canvas
        this.sizes        = {}
        this.camera       = null
        this.renderer     = null
        this.joinTArr     = {}
        this.rootModel    = null
        this.scene        = new THREE.Scene();
        this.clock        = new THREE.Clock();
        this.previousTime = 0;

        this.initWindowSizes()
        this.initCamera()
        this.initScene()
        this.inLights()
        this.initHelper()
        this.initControls()
        this.initRobot()
        this.initRenderer()
        this.initAnimateTick()
    }

    initWindowSizes() {
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

    initScene() {
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

        // const light = new THREE.DirectionalLight(0xffffff);
        // light.position.set(0, 0, 1);
        // this.scene.add(light);
    }

    initCamera() {
        // this.camera    = new THREE.PerspectiveCamera(20, domWidth / domHeight, 1, 10000);
        // this.camera.position.z = 1800;

        const camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 10000);
        camera.position.set(1500, 1500, 1500);
        this.scene.add(camera);
        this.camera = camera;
    }

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

    initHelper() {
        const axes = new THREE.AxesHelper(2000);
        this.scene.add(axes);

        // const gridHelper = new THREE.GridHelper(50000, 100);
        // this.scene.add(gridHelper);
    }

    initControls() {
        const controls = new OrbitControls(this.camera, this.canvas);
        controls.target.set(0, 0.75, 0);
        controls.enableDamping = true;
        this.controls          = controls;
    }

    setControlsEnabled(enabled) {
        this.controls.enabled = enabled
    }


    initRobot = async () => {
        this.joinTArr = {}
        if (this.rootModel) {
            this.scene.remove(this.rootModel);
        }
        const loader           = new STLLoader();
        const sphereMesh       = new THREE.MeshPhongMaterial({color: "#67C23A", specular: 0x494949, shininess: 200})
        const glassMaterial    = new THREE.MeshPhongMaterial({color: '#3d79ff', transparent: true, opacity: 0.4, shininess: 4,})
        const SphereGeometry_d = new THREE.SphereGeometry(.5)
        const boxMesh          = new THREE.MeshPhongMaterial({color: "#E45826", specular: 0x494949, shininess: 200})
        const material         = new THREE.MeshPhongMaterial({color: 0xff9c7c, specular: 0x494949, shininess: 200});
        let setJoint           = (position, size) => {
            const SphereGeometry = new THREE.SphereGeometry(size || 20)
            const joint          = new THREE.Mesh(SphereGeometry, glassMaterial);
            joint.position.set(position.x, position.y, position.z);
            return joint
        }
        let loadingModel       = (name, position, rotation, scale) => {
            return new Promise(((resolve, reject) => {
                let _position = position || {x: -.25, y: 0, z: -.25}
                let _rotation = rotation || {x: 0, y: 0, z: 0}
                loader.load(`/src/assets/human/${name}`, (geometry) => {
                    let Mesh = new THREE.Mesh(geometry, material);
                    Mesh.position.set(_position.x, _position.y, _position.z);
                    Mesh.rotation.set(_rotation.x, _rotation.y, _rotation.z);
                    Mesh.castShadow = true;
                    // Mesh.scale.set(_scale.x, _scale.y, _scale.z);
                    resolve(Mesh)
                });
            }))
        }
        // let modelArr     = []
        let modelArr     = {}
        let boresList    = bores.boresList || []
        let modelNum     = boresList.length
        let setScenes    = async () => {
            for (let key in modelArr) {
                let item = modelArr[key]
                let model = item.model
                let info = item.info
                if (info.parent === 0) {
                    this.rootModel = model
                    this.scene.add(this.rootModel);
                }else {
                    modelArr[info.parent].model.add(model);
                }
                if (info.master_slave === 0) {
                    this.joinTArr[info.field] = model
                }
            }
        }
        let initAllModel = async (item) => {
            let model
            if (item.model_type === 1) {
                model = setJoint(item.position);
            } else {
                try {
                    model = await loadingModel(item.model_name, item.position);
                } catch (e) {
                }
            }
            let data          = {
                model: model,
                info : item
            }
            // modelArr.push(data)
            modelArr[item.id] = data
            modelNum--
            if (modelNum === 0) {
                setScenes()
            }
        }
        boresList.map((item) => {
            initAllModel(item)
        })
    }

    setRobotRotation(rotation, name, direction) {
        this.joinTArr[name].rotation[direction] = rotation
    }

    initRenderer() {
        this.renderer                   = new THREE.WebGLRenderer({
            canvas: this.canvas,
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor("#fff");
    }

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
