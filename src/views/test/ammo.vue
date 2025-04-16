<template>
  <div ref="container" class="three-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const container = ref<HTMLDivElement | null>(null);

let AmmoLib: typeof Ammo | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let controls: OrbitControls | null = null;
let stats: Stats | null = null;
let physicsWorld: Ammo.btDiscreteDynamicsWorld | null = null;
let rigidBodies: THREE.Mesh[] = [];
let clock: THREE.Clock | null = null;
let raycaster: THREE.Raycaster | null = null;
let mouse: THREE.Vector2 | null = null;

const init = async () => {
  try {
    const ammoModule = await import('ammo.js');
    AmmoLib = ammoModule.default;
    if (!AmmoLib) {
      console.error("Failed to load Ammo.js");
      return;
    }
    console.log('AmmoLib', AmmoLib);
    initGraphics();
    initPhysics();
    createObjects();
    initInput();
    animate();
  } catch (error) {
    console.error("Error loading Ammo.js:", error);
  }
};

const initGraphics = () => {
  if (!container.value) return;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfd1e5);

  camera = new THREE.PerspectiveCamera(60, container.value.clientWidth / container.value.clientHeight, 0.2, 2000);
  camera.position.set(-7, 5, 8);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  renderer.shadowMap.enabled = true;
  container.value.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 2, 0);
  controls.update();

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(-10, 10, 5);
  light.castShadow = true;
  const d = 10;
  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;

  light.shadow.camera.near = 2;
  light.shadow.camera.far = 50;

  light.shadow.mapSize.x = 1024;
  light.shadow.mapSize.y = 1024;

  scene.add(light);

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.value.appendChild(stats.domElement);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
};

const initPhysics = () => {
  if (!AmmoLib) return;

  const collisionConfiguration = new AmmoLib.btDefaultCollisionConfiguration();
  const dispatcher = new AmmoLib.btCollisionDispatcher(collisionConfiguration);
  const broadphase = new AmmoLib.btDbvtBroadphase();
  const solver = new AmmoLib.btSequentialImpulseConstraintSolver();
  physicsWorld = new AmmoLib.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
  physicsWorld.setGravity(new AmmoLib.btVector3(0, -9.8, 0));

  clock = new THREE.Clock();
};

const createObjects = () => {
  if (!scene || !physicsWorld || !AmmoLib) return;

  const pos = new THREE.Vector3();
  const quat = new THREE.Quaternion();

  // Ground
  pos.set(0, -0.5, 0);
  quat.set(0, 0, 0, 1);
  const ground = createParalellepiped(40, 1, 40, 0, pos, quat, new THREE.MeshPhongMaterial({ color: 0x8B4513, restitution: 0.5 }));
  ground.castShadow = true;
  ground.receiveShadow = true;
  scene.add(ground);

  // Multiple Balls
  for (let i = 0; i < 5; i++) {
    const ballMass = 1.2;
    const ballRadius = 0.6;
    const ball = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 20, 20), new THREE.MeshPhongMaterial({ color: 0x202020, restitution: 0.5 }));
    ball.castShadow = true;
    ball.receiveShadow = true;
    const ballShape = new AmmoLib.btSphereShape(ballRadius);
    ballShape.setMargin(0.05);
    pos.set(Math.random() * 10 - 5, 5 + Math.random() * 5, Math.random() * 10 - 5);
    quat.set(0, 0, 0, 1);
    createRigidBody(ball, ballShape, ballMass, pos, quat);
    ball.userData.physicsBody.setFriction(0.5);
  }

  // Multiple Boxes
  for (let i = 0; i < 5; i++) {
    const boxMass = 1.0;
    const boxSize = 1.0;
    const box = new THREE.Mesh(new THREE.BoxGeometry(boxSize, boxSize, boxSize), new THREE.MeshPhongMaterial({ color: 0x4682B4, restitution: 0.5 }));
    box.castShadow = true;
    box.receiveShadow = true;
    const boxShape = new AmmoLib.btBoxShape(new AmmoLib.btVector3(boxSize * 0.5, boxSize * 0.5, boxSize * 0.5));
    boxShape.setMargin(0.05);
    pos.set(Math.random() * 10 - 5, 5 + Math.random() * 5, Math.random() * 10 - 5);
    quat.set(0, 0, 0, 1);
    createRigidBody(box, boxShape, boxMass, pos, quat);
    box.userData.physicsBody.setFriction(0.5);
  }

  // Multiple Cylinders
  for (let i = 0; i < 5; i++) {
    const cylinderMass = 1.0;
    const cylinderRadius = 0.5;
    const cylinderHeight = 1.0;
    const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderHeight, 20), new THREE.MeshPhongMaterial({ color: 0x228B22, restitution: 0.5 }));
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    const cylinderShape = new AmmoLib.btCylinderShape(new AmmoLib.btVector3(cylinderRadius, cylinderHeight * 0.5, cylinderRadius));
    cylinderShape.setMargin(0.05);
    pos.set(Math.random() * 10 - 5, 5 + Math.random() * 5, Math.random() * 10 - 5);
    quat.set(0, 0, 0, 1);
    createRigidBody(cylinder, cylinderShape, cylinderMass, pos, quat);
    cylinder.userData.physicsBody.setFriction(0.5);
  }
};

const createParalellepiped = (sx: number, sy: number, sz: number, mass: number, pos: THREE.Vector3, quat: THREE.Quaternion, material: THREE.Material) => {
  const threeObject = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), material);
  const shape = new AmmoLib!.btBoxShape(new AmmoLib!.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
  shape.setMargin(0.05);

  createRigidBody(threeObject, shape, mass, pos, quat);

  return threeObject;
};

const createRigidBody = (threeObject: THREE.Mesh, physicsShape: Ammo.btCollisionShape, mass: number, pos: THREE.Vector3, quat: THREE.Quaternion) => {
  threeObject.position.copy(pos);
  threeObject.quaternion.copy(quat);

  const transform = new AmmoLib!.btTransform();
  transform.setIdentity();
  transform.setOrigin(new AmmoLib!.btVector3(pos.x, pos.y, pos.z));
  transform.setRotation(new AmmoLib!.btQuaternion(quat.x, quat.y, quat.z, quat.w));
  const motionState = new AmmoLib!.btDefaultMotionState(transform);

  const localInertia = new AmmoLib!.btVector3(0, 0, 0);
  physicsShape.calculateLocalInertia(mass, localInertia);

  const rbInfo = new AmmoLib!.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia);
  const body = new AmmoLib!.btRigidBody(rbInfo);

  // Set restitution (elasticity) for the rigid body
  body.setRestitution(0.5);

  threeObject.userData.physicsBody = body;

  scene!.add(threeObject);

  if (mass > 0) {
    rigidBodies.push(threeObject);
    body.setActivationState(4);
  }

  physicsWorld!.addRigidBody(body);
};

const initInput = () => {
  if (!container.value) return;

  container.value.addEventListener('click', (event) => {
    if (!camera || !scene || !renderer || !raycaster || !mouse) return;

    mouse!.x = (event.clientX / container.value.clientWidth) * 2 - 1;
    mouse!.y = -(event.clientY / container.value.clientHeight) * 2 + 1;

    raycaster!.setFromCamera(mouse!, camera);

    const intersects = raycaster!.intersectObjects(rigidBodies);
    if (intersects.length > 0) {
      const intersect = intersects[0];
      const body = intersect.object.userData.physicsBody as Ammo.btRigidBody;

      // Calculate the direction vector from the object to the click point
      const objectPosition = new THREE.Vector3();
      intersect.object.getWorldPosition(objectPosition);
      const clickPosition = new THREE.Vector3(mouse!.x, mouse!.y, 1);
      clickPosition.unproject(camera);
      const direction = clickPosition.sub(objectPosition).normalize();

      // Apply force in the direction of the click
      const forceMagnitude = 500;
      const force = new AmmoLib!.btVector3(direction.x * forceMagnitude, direction.y * forceMagnitude, direction.z * forceMagnitude);
      body.applyCentralForce(force);
    }
  });

  container.value.addEventListener('mousemove', (event) => {
    if (!camera || !scene || !renderer || !raycaster || !mouse) return;

    mouse!.x = (event.clientX / container.value.clientWidth) * 2 - 1;
    mouse!.y = -(event.clientY / container.value.clientHeight) * 2 + 1;

    raycaster!.setFromCamera(mouse!, camera);

    const intersects = raycaster!.intersectObjects(rigidBodies);
    if (intersects.length > 0) {
      container.value.style.cursor = 'pointer';
    } else {
      container.value.style.cursor = 'move';
    }
  });

  window.addEventListener('keydown', (event) => {
    if (!camera) return;

    const speed = 0.1;
    switch (event.key) {
      case 'ArrowUp':
        camera.position.y += speed;
        break;
      case 'ArrowDown':
        camera.position.y -= speed;
        break;
      case 'ArrowLeft':
        camera.position.x -= speed;
        break;
      case 'ArrowRight':
        camera.position.x += speed;
        break;
      case 'PageUp':
        camera.position.z -= speed;
        break;
      case 'PageDown':
        camera.position.z += speed;
        break;
    }
  });
};

const onWindowResize = () => {
  if (!camera || !renderer || !container.value) return;

  camera.aspect = container.value.clientWidth / container.value.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
};

const animate = () => {
  requestAnimationFrame(animate);

  render();
  stats!.update();
};

const render = () => {
  if (!clock || !physicsWorld) return;

  const deltaTime = clock.getDelta();

  updatePhysics(deltaTime);

  renderer!.render(scene!, camera!);
};

const updatePhysics = (deltaTime: number) => {
  if (!physicsWorld) return;

  physicsWorld.stepSimulation(deltaTime, 10);

  for (let i = 0, il = rigidBodies.length; i < il; i++) {
    const objThree = rigidBodies[i];
    const objPhys = objThree.userData.physicsBody as Ammo.btRigidBody;
    const ms = objPhys.getMotionState();
    if (ms) {
      const transform = new AmmoLib!.btTransform();
      ms.getWorldTransform(transform);
      const p = transform.getOrigin();
      const q = transform.getRotation();
      objThree.position.set(p.x(), p.y(), p.z());
      objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
    }
  }
};

onMounted(() => {
  init();
  window.addEventListener('resize', onWindowResize);
});

onUnmounted(() => {
  if (renderer && container.value) {
    renderer.dispose();
    container.value.removeChild(renderer.domElement);
  }
  window.removeEventListener('resize', onWindowResize);
});
</script>

<style scoped>
.three-container {
  width: 100vw;
  height: 100vh;
  background-color: #f0f0f0;
  border: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
