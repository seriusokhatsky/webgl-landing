import * as THREE from 'three'

import vertexShader from '../shaders/vertexShader.glsl';
import fragmentShader from '../shaders/fragmentShader.glsl';
import { TweenMax } from 'gsap';

export default class Image {
	constructor( el, imgW, imgH, scroll ) {
		this.animationTime = 1.3;
		this.width = imgW;
		this.height = imgH;
		this.content = document.querySelectorAll('.scroll-content')[0];
		this.progressIdicator = document.querySelectorAll('.scroll-progress-indicator')[0];

		this.enlarged = false;

		this.screenPosition = 0;

		var img = el.querySelector('img');

		var fullSrc = img.getAttribute('data-full-img');

		var fullImgLoaded = false;
		var loading = false;

		var scale = 1;
		var planeSize = imgW / scale;

		this.geometry = new THREE.PlaneGeometry( planeSize, planeSize * imgH / imgW, 1, 16 );
		var loader = new THREE.TextureLoader();

		this.texture = new THREE.TextureLoader().load( img.src );

		this.texture.minFilter = THREE.LinearFilter;

		this.material = new THREE.ShaderMaterial( {
			uniforms: {
				u_time: { value: 1.0 },
				u_pos: { value: 1.0 },
				u_hover: { value: 0. },
				texture: { type: 't', value: this.texture },
				resolution: {type: 'v2', value: new THREE.Vector2(window.innerWidth,window.innerHeight)},
				imgResolution: {type: 'v2', value: new THREE.Vector2(imgW,imgH)},
				u_uvrate: {type: 'v2', value: imgW / imgH},
			},
			vertexShader: vertexShader,
			fragmentShader: fragmentShader
		
		} );

		img.addEventListener('mouseenter', () => {
			var tl = new TimelineMax();
			tl.to(this.material.uniforms.u_hover, this.animationTime, { ease: Power4.easeOut, value: 1.0 } );
			});

		img.addEventListener('mouseleave', () => {
			var tl = new TimelineMax();
			tl.to(this.material.uniforms.u_hover, this.animationTime, { ease: Power4.easeOut, value: 0.0 } );
		});

		img.addEventListener('click', (e) => {
			if( loading ) {
				return;
			}
			if( fullImgLoaded ) {
				this.enlarge( fullImgLoaded );
				return;
			}
			loader.load(
				fullSrc,
				( texture ) => {
					texture.minFilter = THREE.LinearFilter;
					fullImgLoaded = texture;
					loading = false;
					this.enlarge(texture);
				},
				undefined,
				( err ) => {
					console.error( 'An error happened.' );
					loading = false;
				}
			);
		});

		this.plane = new THREE.Mesh( this.geometry, this.material );


		var imgRect = el.getBoundingClientRect();

		// console.log(imgRect.x, imgRect.y);

		this.planePosition = {
			x: imgRect.x + img.width / 2,
			y: -imgRect.y - img.height / 2
		}

		this.plane.position.x = this.planePosition.x;
		this.plane.position.y = this.planePosition.y;

		scroll.on('scroll', (position) => {
			this.screenPosition = position;
			TweenMax.to(this.material.uniforms.u_pos, this.animationTime, { ease: Power4.easeOut, value: position } );
		});

		window.addEventListener('resize', () => {
			this.material.uniforms.resolution.value = new THREE.Vector2(window.innerWidth,window.innerHeight);
		});

		return this.plane;
	}

	enlarge(texture) {
		if( this.enlarged ) {
			this.material.uniforms.texture.value = this.texture;
			TweenMax.to(this.plane.scale, .5, { ease: Power4.easeOut, x: 1, y: 1 });
			TweenMax.to(this.plane.position, .5, { ease: Power4.easeOut, x: this.planePosition.x, y: this.planePosition.y });
			this.enlarged = false;
			return;
		}
		var { width, height } = texture.image;
		this.material.uniforms.texture.value = texture;
		var scaleX = width/this.width;
		var scaleY = height/this.height;
		TweenMax.to(this.plane.scale, .5, { ease: Power4.easeOut, x: scaleX, y: scaleY });
		TweenMax.to(this.plane.position, .5, { ease: Power4.easeOut, x: window.innerWidth/2, y: -height/2 + this.screenPosition });
		this.enlarged = true;
	}
}