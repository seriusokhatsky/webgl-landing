import * as THREE from 'three'

import vertexShader from '../shaders/vertexShader.glsl';
import fragmentShader from '../shaders/fragmentShader.glsl';

export default class Image {
	constructor( el, imgW, imgH, scroll ) {
		this.animationTime = 1.3;

		var img = el.querySelector('img');

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
				u_hover: { value: 0. },
				texture: { type: 't', value: texture },
				resolution: {type: 'v2', value: new THREE.Vector2(window.innerWidth,window.innerHeight)},
				imgResolution: {type: 'v2', value: new THREE.Vector2(imgW,imgH)},
				u_uvrate: {type: 'v2', value: imgW / imgH},
			},
			vertexShader: vertexShader,
			fragmentShader: fragmentShader
		
		} );

		img.addEventListener('mouseenter', () => {
			var tl = new TimelineMax();
			tl.to(material.uniforms.u_hover, this.animationTime, { ease: Power4.easeOut, value: 1.0 } );
			});

		img.addEventListener('mouseleave', () => {
			var tl = new TimelineMax();
			tl.to(material.uniforms.u_hover, this.animationTime, { ease: Power4.easeOut, value: 0.0 } );
		});

		var plane = new THREE.Mesh( geometry, material );


		var imgRect = el.getBoundingClientRect();

		// console.log(imgRect.x, imgRect.y);

		plane.position.x = imgRect.x + img.width / 2;
		plane.position.y = -imgRect.y - img.height / 2;

		scroll.on('scroll', (position) => {
			var tl = new TimelineMax();
			tl.clear().to(material.uniforms.u_pos, this.animationTime, { ease: Power4.easeOut, value: position } );
		});

		window.addEventListener('resize', () => {
			material.uniforms.resolution.value = new THREE.Vector2(window.innerWidth,window.innerHeight);
		});

		return plane;
	}
}