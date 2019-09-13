import './../sass/style.scss';
import { TimelineMax } from 'gsap';
import { THREE } from 'three';

import vertexShader from './vertexShader.glsl';
import fragmentShader from './fragmentShader.glsl';

import img1 from './../assets/1.jpg';

class Scroll {

	constructor() {
		this.position = 0;
		this.content = document.querySelectorAll('.scroll-content')[0];
		this.progressIdicator = document.querySelectorAll('.scroll-progress-indicator')[0];
		this.height = this.content.offsetHeight;
		this.windowHeight = window.innerHeight;
		this.progress = 0;
		this.event = undefined;
		this.animationTime = 1.3;

		window.addEventListener('mousewheel', this.onScroll.bind(this));

	}

	onScroll(e) {
		if( this.position - e.deltaY <= -this.height + this.windowHeight ) {
			this.position = -this.height + this.windowHeight;
		} else if( this.position - e.deltaY >= 0 ) {
			this.position = 0;
		} else {
			this.position -= e.deltaY;
		}
		this.updatePosition();

		if( this.event ) {
			this.event(this.position);
		}

	}

	updatePosition() {
		this.progress = -this.position / (this.height - this.windowHeight);

		this.scrollTo(this.position);
		
	}

	scrollTo(position) {
		var tl = new TimelineMax();
		var tl2 = new TimelineMax();
		tl.to(this.content, this.animationTime, { ease: Power4.easeOut, y:position } );

		tl2.to(this.progressIdicator, this.animationTime, { ease: Power4.easeOut, height: this.progress * this.windowHeight } );
	}

	addEvent(f) {
		this.event = f;
	}
	
}

class WebGLCanvas {
	constructor(scroll) {
		var that = this;
		this.canvas = document.getElementById('main-canvas');
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		this.camera.position.z = 70;
		this.renderer = new THREE.WebGLRenderer( { canvas: this.canvas, alpha: true, antialias: true } );
		this.renderer.setSize( window.innerWidth, window.innerHeight );

		this.renderer.setPixelRatio(window.devicePixelRatio);

		var images = document.querySelectorAll('.float-image');

		images.forEach((el) => {
			var img = el.querySelector('img');
			var imgW = img.width;
			var imgH = img.height;
			var scale = 1;
	
			var planeSize = imgW / scale;
	
			var geometry = new THREE.PlaneGeometry( planeSize, planeSize * imgH / imgW, 1, 16 );
			var material;
	
			material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
	
			var texture = new THREE.TextureLoader().load( img.src );

			texture.minFilter = THREE.LinearFilter;
	
			material = new THREE.ShaderMaterial( {
				uniforms: {
					u_time: { value: 1.0 },
					u_pos: { value: 1.0 },
					texture: { type: 't', value: texture },
					resolution: {type: 'v2', value: new THREE.Vector2(window.innerWidth,window.innerHeight)},
					imgResolution: {type: 'v2', value: new THREE.Vector2(imgW,imgH)},
				},
				vertexShader: vertexShader,
				fragmentShader: fragmentShader
			
			} );
	
			var plane = new THREE.Mesh( geometry, material );
			this.scene.add( plane );
	
	
			// var cameraZ = this.camera.position.z;
			// var planeZ = 5;
			// var distance = cameraZ - planeZ;
			// var aspect = window.innerWidth / window.innerHeight;
			// var vFov = this.camera.fov * Math.PI / 180;
			// var planeHeightAtDistance = 2 * Math.tan(vFov / 2) * distance;
			// var planeWidthAtDistance = planeHeightAtDistance * aspect;
	
			// or
	
			var imgRect = el.getBoundingClientRect();

			// console.log(imgRect.x, imgRect.y);

			plane.position.x = imgRect.x + img.width / 2;
			plane.position.y = -imgRect.y - img.height / 2;

			var cameraOffset = {
				x: window.innerWidth / 2,
				y: -window.innerHeight / 2
			};
	
	
			let dist = this.camera.position.z - plane.position.z;
			let height = window.innerHeight;
			this.camera.fov = 2 * Math.atan(height / (2 * dist)) * (180 / Math.PI);
			this.camera.updateProjectionMatrix();
			this.camera.position.x = cameraOffset.x;
			this.camera.position.y = cameraOffset.y;
	
			scroll.addEvent(function(position) {
				console.log(position);
				
				var tl4 = new TimelineMax();
				tl4.to(that.camera.position, this.animationTime, { ease: Power4.easeOut, y: cameraOffset.y + position} );
				var tl5 = new TimelineMax();
				tl5.to(material.uniforms.u_pos, this.animationTime, { ease: Power4.easeOut, value: position } );
			});
	
		});


		var time = 0.1;

		function animate() {
			time += 0.1;
			// material.uniforms.u_time.value = time;
			requestAnimationFrame( animate );
			that.renderer.render(that.scene, that.camera);
		}
		animate();
	}
}

window.addEventListener('DOMContentLoaded', function() {
	setTimeout(function() {
		var scroll = new Scroll();
		new WebGLCanvas(scroll);
	}, 500); // TODO: Fix google fonts loading delay
});
