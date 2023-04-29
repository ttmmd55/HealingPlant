import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

		let camera, scene, renderer, controls;
		let tree;
		//let controller;
		//let mixer;

		const gltfLoader = new GLTFLoader();
		const url = 'assets/tree2.0.glb';
		gltfLoader.load(url, (gltf) => {
		  const tree = gltf.scene;
		  scene.add(tree);
		//   mixer = new THREE.AnimationMixer(tree);
		//   const clips = gltf.animations;
		//   const clip = THREE.AnimationClip.findByName(clips,'Vert.010Action');
		//   const action = mixer.clipAction(clip); 
		//   action.play();
		});
		  

		init();
		animate();

		

		function init() {

			const container = document.createElement('div');
			document.body.appendChild(container);

			scene = new THREE.Scene();

			camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

			const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
			light.position.set(0.5, 1, 0.25);
			scene.add(light);
			const lightB = new THREE.DirectionalLight()
			lightB.castShadow = true
			lightB.shadow.mapSize.width = 640
			lightB.shadow.mapSize.height = 480
			lightB.shadow.camera.near = 0.5
			lightB.shadow.camera.far = 100
			scene.add(lightB);

			//

			renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.xr.enabled = true;
			container.appendChild(renderer.domElement);


			//
			document.body.appendChild(ARButton.createButton(renderer));

			// Create touch event listener for displaying the tree
			document.addEventListener('touchstart', (event) => {
				event.preventDefault();

				if (!tree) return;

				// Create a raycaster and set its position based on the touch event
				const raycaster = new THREE.Raycaster();
				const touch = event.touches[0];
				const x = (touch.clientX / window.innerWidth) * 2 - 1;
				const y = -(touch.clientY / window.innerHeight) * 2 + 1;
				raycaster.setFromCamera({ x, y }, camera);

				// Find the first intersected object and display the model at its position
				const intersects = raycaster.intersectObjects(scene.children, true);
				if (intersects.length > 0) {
				const intersect = intersects[0];
				const position = new THREE.Vector3().copy(intersect.point);
				model.position.copy(position);
				model.visible = true;
				}
			}, { passive: false });

			// Create a controls object for device orientation
			controls = new THREE.DeviceOrientationControls(camera);
			controls.enabled = false;
			}

			function animate() {
			renderer.setAnimationLoop(render);
			}

			function render() {
			// Update controls and render scene
			controls.update();
			renderer.render(scene, camera);
			}
			//

		// 	function onSelect() {

		// 		const material = new THREE.MeshPhongMaterial( { color: 0xffffff * Math.random() } );
		// 		const mesh = new THREE.Mesh(geometry, material);
		// 		mesh.position.set(0, 0, - 10).applyMatrix4(controller.matrixWorld);
		// 		mesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
		// 		mesh.scale.set( 0.05, 0.05, 0.05 );
		// 		scene.add(mesh);
		// 	}

		// 	controller = renderer.xr.getController(0);
		// 	controller.addEventListener('select', onSelect);
		// 	scene.add(controller);

		// 	//

		// 	window.addEventListener('resize', onWindowResize);

		// }

		// function onWindowResize() {

		// 	camera.aspect = window.innerWidth / window.innerHeight;
		// 	camera.updateProjectionMatrix();

		// 	renderer.setSize(window.innerWidth, window.innerHeight);

		// }

		// //
		// //const clock = new THREE.Clock();
		// function animate() {
		// 	// if(mixer)
		// 	// 	mixer.update(clock.getDelta());
		// 	renderer.setAnimationLoop(render);

		// }

		// function render() {

		// 	renderer.render(scene, camera);

		// }