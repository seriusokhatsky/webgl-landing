import { TimelineMax } from 'gsap';
import * as THREE from 'three'

console.log(THREE);

export default class WebGLCanvas {
	constructor(scroll) {
		const ANTIALISE = true;
		this.canvas = document.getElementById('main-canvas');
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 75, this.width / this.height, 0.1, 1000 );
		this.camera.position.z = 70;
		this.renderer = new THREE.WebGLRenderer( { canvas: this.canvas, alpha: true, antialias: ANTIALISE } ); // , antialias: true
		this.renderer.setSize( this.width, this.height );
		this.animationTime = 1.3;
		this.scroll = scroll;
		this.resizing = false;
		this.resizingTimeout = 0;

		var that = this;

		// this.renderer.setPixelRatio(window.devicePixelRatio);
		
		this.scroll.on('scroll', (position) => {
			var tl = new TimelineMax();
			tl.to(this.camera.position, this.animationTime, { ease: Power4.easeOut, y: this.cameraOffset.y + position} );
		});

		var time = 0.1;

		this.scalePlaneToscreen();

		function animate() {
			time += 0.1;
			requestAnimationFrame( animate );

			if( that.needsRender() ) {
				that.renderer.render(that.scene, that.camera);
			}
		}
		animate();

		window.addEventListener('resize', () => {
			this.resizing = true;
			clearTimeout( this.resizingTimeout );
			this.resizingTimeout = setTimeout(() => {
				this.resize();
				this.resizing = false;
			}, 300);
		});
	}

	needsRender() {
		// if( ! this.scroll.isScrolling() ) {
		// 	return false;
		// }
		return true;
	}

	resize() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.scalePlaneToscreen();
		this.renderer.setSize( this.width, this.height );
	}

	scalePlaneToscreen() {

		// scale plane to screen
		let dist = this.camera.position.z - 0; // plane.position.z
		this.camera.fov = 2 * Math.atan(this.height / (2 * dist)) * (180 / Math.PI);
		this.camera.updateProjectionMatrix();

			
		this.cameraOffset = {
			x: this.width / 2,
			y: - this.height / 2
		};

		let scrollPosition = this.scroll.getPosition();
		this.camera.position.x = this.cameraOffset.x;
		this.camera.position.y = scrollPosition + this.cameraOffset.y;
	}
	
	addMesh( mesh ) {
		this.scene.add( mesh );
	}
}