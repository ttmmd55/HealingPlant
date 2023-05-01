import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

		let camera, scene, renderer;
		let controller;

		const modelInstances = [];
		

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
			const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
			directionalLight.position.set(0, 1, 0);
			scene.add(directionalLight);


			//

			renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.xr.enabled = true;
			container.appendChild(renderer.domElement);


			//
			document.body.appendChild(ARButton.createButton(renderer));

			//

			const loader = new GLTFLoader();

			loader.load( 'assets/tree3.0.glb', function(gltf) {
				const model = gltf.scene;
				modelInstances.push(model);
			
			});

			controller = renderer.xr.getController(0);
			controller.addEventListener('select', onSelect);
			scene.add(controller);

			//

			window.addEventListener('resize', onWindowResize);
			
			function onSelect() {
				const modelInstance = modelInstances[modelInstances.length - 1].clone();
				modelInstance.scale.set(0.3, 0.3, 0.3);
				modelInstance.position.set(0, 0, -1).applyMatrix4(controller.matrixWorld);
				modelInstance.quaternion.setFromRotationMatrix(controller.matrixWorld);
				scene.add(modelInstance);
				modelInstances.push(modelInstance);
			}

			

		}

		function onWindowResize() {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize(window.innerWidth, window.innerHeight);

		}

		//
	
		function animate() {
			renderer.setAnimationLoop(render);

		}

		function render() {

			renderer.render(scene, camera);

		}