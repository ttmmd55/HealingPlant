import * as THREE from 'three';
		import { ARButton } from 'three/addons/webxr/ARButton.js';
		import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

		let camera, scene, renderer;
		let controller;

		const geometries = [
			new THREE.BoxGeometry(0.04, 0.04, 0.04).rotateX( Math.PI / 2 ),
			new THREE.ConeGeometry(0.04, 0.04, 64).rotateX( Math.PI / 2 ),
			new THREE.CylinderGeometry(0.04, 0.04, 0.1, 5).rotateX( Math.PI / 2 ),
			new THREE.CylinderGeometry(0.04, 0.04, 0.04, 64).rotateX( Math.PI / 2 ),
			new THREE.IcosahedronGeometry(0.04, 8).rotateX( Math.PI / 2 ),
			new THREE.IcosahedronGeometry(0.04, 4).rotateX( Math.PI / 2 ),
			new THREE.TorusGeometry(0.04, 0.008, 64, 32).rotateX( Math.PI / 2 )
		];

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
				const geometry = geometries[Math.floor(Math.random() * geometries.length)];
				// const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random() });
				// const material = new THREE.MeshPhysicalMaterial({
				// 	color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
				// 	metalness: 1,
				// 	roughness: 0.1
				// });
					const material = new THREE.MeshPhysicalMaterial({
					color: new THREE.Color().setHSL(Math.random(), 1, 0.5)
				});
				const mesh = new THREE.Mesh(geometry, material);
				mesh.position.set(0, 0, - 0.3).applyMatrix4(controller.matrixWorld);
				mesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
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

		function animate() {

			renderer.setAnimationLoop(render);

		}

		function render() {

			renderer.render(scene, camera);

		}