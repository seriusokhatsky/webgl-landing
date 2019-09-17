import { THREE } from 'three';

import vertexShader from '../shaders/linesvertexShader.glsl';
import fragmentShader from '../shaders/linesShader.glsl';

export default class Lines {
	constructor(scroll) {
		const scale = 1.2;
		var width = window.innerWidth * scale;
		var height = window.innerHeight * scale;

		var geometry = new THREE.PlaneGeometry( width, height  );
		var material = new THREE.ShaderMaterial( {
			uniforms: {
				u_time: { value: 1.0 },
				u_pos: { value: 0.0 },
				u_hover: { value: 0. },
				resolution: {type: 'v2', value: new THREE.Vector2(width,height)},
				u_uvrate: {type: 'v2', value: width / height},
			},
			vertexShader: vertexShader,
			fragmentShader: fragmentShader
		
		} );

		

		var plane = new THREE.Mesh( geometry, material );

		plane.position.x = width / 2 / scale;
		plane.position.y = -height /2 / scale;
		plane.position.z = -10;

		scroll.on('scroll', (position) => {
			var tl = new TimelineMax();
			var tl2 = new TimelineMax();
			tl.clear().to(plane.position, 1.3, { ease: Power4.easeOut, y: -height /2 / scale + position } );
			tl2.clear().to(material.uniforms.u_pos, 1.3, { ease: Power4.easeOut, value: position } );
		});

		return plane;
	}
}