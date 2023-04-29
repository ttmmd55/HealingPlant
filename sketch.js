import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

		let camera, scene, renderer;
		let controller;
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

			//

			function onSelect() {

				const material = new THREE.MeshPhongMaterial( { color: 0xffffff * Math.random() } );
				const mesh = new THREE.Mesh(geometry, material);
				mesh.position.set(0, 0, - 10).applyMatrix4(controller.matrixWorld);
				mesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
				mesh.scale.set( 0.05, 0.05, 0.05 );
				scene.add(mesh);
			}

			controller = renderer.xr.getController(0);
			controller.addEventListener('select', onSelect);
			scene.add(controller);

			//

			window.addEventListener('resize', onWindowResize);

		}

		function onWindowResize() {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize(window.innerWidth, window.innerHeight);

		}

		//
		//const clock = new THREE.Clock();
		function animate() {
			// if(mixer)
			// 	mixer.update(clock.getDelta());
			renderer.setAnimationLoop(render);

		}

		function render() {

			renderer.render(scene, camera);

		}