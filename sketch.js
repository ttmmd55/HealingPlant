import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

		let camera, scene, renderer;
		let controller;

		
		

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
			// const lightB = new THREE.DirectionalLight()
			// lightB.castShadow = true
			// lightB.shadow.mapSize.width = 640
			// lightB.shadow.mapSize.height = 480
			// lightB.shadow.camera.near = 0.5
			// lightB.shadow.camera.far = 100
			// scene.add(lightB);
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
			// const gltfLoader = new GLTFLoader();
			// const url = 'assets/tree2.0.glb';
			// gltfLoader.load(url, (gltf) => {
			// const tree = gltf.scene;
			// scene.add(tree);
			// });

			const loader = new THREE.GLTFLoader();

			loader.load( 'assets/tree2.0.glb', function ( gltf ) {
			
				const model = gltf.scene;
				scene.add( model );
			
			});
			
			function onSelect() {
				//const leaf = gltfLoader[Math.floor(Math.random() * gltfLoader.length)];
				//const geometry = geometries[Math.floor(Math.random() * geometries.length)];
				// const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random() });
				// const material = new THREE.MeshPhysicalMaterial({
				// 	color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
				// 	metalness: 1,
				// 	roughness: 0.1
				// });
				// 	const material = new THREE.MeshPhysicalMaterial({
				// 	color: new THREE.Color().setHSL(Math.random(), 1, 0.5)
				// });

				

				//const material = new THREE.MeshPhongMaterial( { color: 0xffffff * Math.random() } );
				// const mesh = new THREE.Mesh(gltfLoader);//, material);
				// mesh.position.set(0, 0, - 10).applyMatrix4(controller.matrixWorld);
				// mesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
				// scene.add(mesh);
				const modelInstance = model.clone();
				modelInstance.position.set( 0, 0, - 0.1 ).applyMatrix4( controller.matrixWorld );
				modelInstance.quaternion.setFromRotationMatrix( controller.matrixWorld );
				scene.add( modelInstance );
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
	
		function animate() {
			renderer.setAnimationLoop(render);

		}

		function render() {

			renderer.render(scene, camera);

		}