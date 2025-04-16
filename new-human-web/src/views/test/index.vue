
function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  if (selectedObject && selectedObject.userData.physicsBody) { // 确保 selectedObject 存在且有 physicsBody
    const transform = new Ammo.btTransform();
    transform.setIdentity();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
      const pos = intersects[0].point;
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
      selectedObject.userData.physicsBody.setWorldTransform(transform); // 使用 selectedObject 的 physicsBody
    }
  }
}


function initThree() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true }); // 启用抗锯齿
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Add renderer to the container
  if (container.value) {
    container.value.appendChild(renderer.domElement);
  } else {
    console.error("Container element not found");
  }

  // 添加天空盒
  const skyBoxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
  const skyBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide });
  const skyBoxMesh = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
  scene.add(skyBoxMesh);

  // Add ground with texture
  const groundTexture = new THREE.TextureLoader().load('path/to/ground_texture.jpg'); // 替换为实际纹理路径
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set(10, 10);
  const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
  const groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), groundMaterial);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -0.5;
  scene.add(groundMesh);

  // Add chain links
  const linkGeometry = new THREE.CylinderGeometry(0.25, 0.25, 1, 32); // Iron ring geometry
  const linkMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  for (let i = 0; i < 10; i++) {
    const linkMesh = new THREE.Mesh(linkGeometry, linkMaterial);
    linkMesh.position.set(0, 2 + i * 1, 0);
    scene.add(linkMesh);

    // Associate the Ammo.js RigidBody with the Three.js Mesh
    const linkTransform = new Ammo.btTransform();
    linkTransform.setIdentity();
    linkTransform.setOrigin(new Ammo.btVector3(0, 2 + i * 1, 0));
    const linkMotionState = new Ammo.btDefaultMotionState(linkTransform);
    linkMesh.userData.physicsBody = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(1, linkMotionState, new Ammo.btCylinderShape(new Ammo.btVector3(0.25, 0.5, 0.25))));
    physicsWorld.addRigidBody(linkMesh.userData.physicsBody);
  }

  camera.position.z = 20;
  clock = new THREE.Clock();

  // 添加鼠标事件监听
  window.addEventListener('mousedown', onMouseDown, false);
  window.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('mouseup', onMouseUp, false);
}
