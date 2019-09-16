
import { TimelineMax } from 'gsap';
import { THREE } from 'three';

export default class WebGLCanvas {
	constructor(scroll) {
		this.canvas = document.getElementById('main-canvas');
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		this.camera.position.z = 70;
		this.renderer = new THREE.WebGLRenderer( { canvas: this.canvas, alpha: true } ); // , antialias: true
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.imagesMaterials = [];
		this.animationTime = 1.3;

		var that = this;

		this.renderer.setPixelRatio(window.devicePixelRatio);
			
		this.cameraOffset = {
			x: window.innerWidth / 2,
			y: -window.innerHeight / 2
		};

		scroll.on('scroll', (position) => {

			var tl4 = new TimelineMax();
			tl4.to(that.camera.position, this.animationTime, { ease: Power4.easeOut, y: this.cameraOffset.y + position} );
			
		});

		var time = 0.1;

		this.scalePlaneToscreen();

		function animate() {
			time += 0.1;
			that.imagesMaterials.forEach((el) => {
				el.uniforms.u_time.value = time;
			})
			requestAnimationFrame( animate );
			that.renderer.render(that.scene, that.camera);
		}
		animate();
	}

	scalePlaneToscreen() {

		// scale plane to screen
		let dist = this.camera.position.z - 0; // plane.position.z
		let height = window.innerHeight;
		this.camera.fov = 2 * Math.atan(height / (2 * dist)) * (180 / Math.PI);
		this.camera.updateProjectionMatrix();
		this.camera.position.x = this.cameraOffset.x;
		this.camera.position.y = this.cameraOffset.y;
	}
	
	addMesh( mesh ) {
		this.scene.add( mesh );
	}
}