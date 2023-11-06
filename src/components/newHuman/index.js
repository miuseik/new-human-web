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
        // this.scene.background = new THREE.Color(0x72645b);
        // this.scene.fog        = new THREE.Fog(0x72645b, 2, 10000);
        const plane           = new THREE.Mesh(
            // new THREE.PlaneGeometry(40000, 40000),
            // new THREE.MeshPhongMaterial({color: 0xcbcbcb, specular: 0x474747})
        );
        plane.rotation.x      = -Math.PI / 2;
        plane.position.y      = -.5;
        plane.receiveShadow = true;
        this.scene.add(plane);
    }

    initCamera() {
        const camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 10000);
        camera.position.set(1500, 1500, 1500);
        this.scene.add(camera);
        this.camera = camera;
    }
    addShadowedLight( x, y, z, color, intensity ) {

        const directionalLight = new THREE.DirectionalLight( color, intensity );

    }
    inLights() {
        const addShadowedLight = ( x, y, z, color, intensity )  => {
            const directionalLight = new THREE.DirectionalLight( color, intensity );
            directionalLight.position.set( x, y, z );
            directionalLight.castShadow = true;
            const d = 1;
            directionalLight.shadow.camera.left = - d;
            directionalLight.shadow.camera.right = d;
            directionalLight.shadow.camera.top = d;
            directionalLight.shadow.camera.bottom = - d;
            directionalLight.shadow.camera.near = 1;
            directionalLight.shadow.camera.far = 4;
            directionalLight.shadow.bias = - 0.002;
            this.scene.add( directionalLight );
        }
        this.scene.add( new THREE.HemisphereLight( 0x8d7c7c, 0x494966, 3 ) );
        addShadowedLight( 500, 500, 500, 0xffffff, 3.5 );
        addShadowedLight( 1000, 1000, 800, 0xffd500, 3 );
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
        const glassMaterial    = new THREE.MeshPhongMaterial({color: '#3d79ff', transparent: true, opacity: 0.4, shininess: 4,})
        const material         = new THREE.MeshPhongMaterial({color: 0xff9c7c, specular: 0x494949, shininess: 200});
        let setJoint           = (size,position) => {
            let _position = position || {x: 0, y: 0, z: 0}
            let _size = size || 5
            const SphereGeometry = new THREE.SphereGeometry(_size)
            const joint          = new THREE.Mesh(SphereGeometry, glassMaterial);
            joint.position.set(_position['x'], _position['y'], _position['z']);
            return joint
        }
        let loadingModel       = (name, position) => {
            return new Promise(((resolve, reject) => {
                let _position = position || {x: -.25, y: 0, z: -.25}
                let _name = name || ''
                loader.load(`/src/assets/human/${_name}`, (geometry) => {
                    let Mesh = new THREE.Mesh(geometry, material);
                    Mesh.position.set(_position.x, _position.y, _position.z);
                    Mesh.castShadow = true;
                    resolve(Mesh)
                });
            }))
        }
        // let modelArr     = []
        let modelArr           = {}
        let boresList          = bores.boresList || []
        let modelNum           = boresList.length
        let setScenes          = async () => {
            for (let key in modelArr) {
                let item  = modelArr[key]
                let model = item.model
                let info  = item.info
                if (info.parent === 0) {
                    this.rootModel = model
                    this.scene.add(this.rootModel);
                } else {
                    modelArr[info.parent].model.add(model);
                    // console.log(key)
                    if (info.field === 'D2') {
                        const axes = new THREE.AxesHelper(2000);
                        model.add(axes);
                    }
                }
                if (info.master_slave === 0) {
                    // this.joinTArr[info.field] = model
                    this.joinTArr[info.field] = item
                }
            }
            bores.joinTArr = this.joinTArr
        }
        let initAllModel       = async (item) => {
            let model
            if (item.model_type === 1) {
                console.log(item['size'])
                model = setJoint(item['size'], item['position']);
            } else {
                try {
                    model = await loadingModel(item['model_name'], item['position']);
                } catch (e) {
                }
            }
            let data          = {
                model: model,
                info : item
            }
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
        this.joinTArr[name]['model'].rotation[direction] = rotation
        // this.joinTArr[name]['model'][`rotate${direction.toUpperCase()}`](rotation)
    }

    initRenderer() {
        this.renderer                = new THREE.WebGLRenderer({
            antialias: true, //开启锯齿
            alpha    : true,
            canvas   : this.canvas,
        });
        this.renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.useLegacyLights = false;
        this.renderer.shadowMap.enabled = true;
    }

    initAnimateTick() {
        const elapsedTime = this.clock.getElapsedTime();
        const deltaTime   = elapsedTime - this.previousTime;
        this.previousTime = elapsedTime;
        //Update controls
        // this.controls.update();
        // Render
        this.renderer.render(this.scene, this.camera);
        // Call tick again on the next frame
        window.requestAnimationFrame(() => {
            this.initAnimateTick()
        });
    }
}
