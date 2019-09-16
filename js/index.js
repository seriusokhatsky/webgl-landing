import './../sass/style.scss';

import Scroll from './scroll';
import WebGLCanvas from './webgl';
import Image from './webgl-parts/image';

class App {
	constructor() {
		var scroll = new Scroll();
		var webgl = new WebGLCanvas(scroll);

		var images = document.querySelectorAll('.float-image');

		images.forEach((el) => {
			var img = el.querySelector('img');
			var imgW = img.width;
			var imgH = img.height;
			var image = new Image( el, imgW, imgH, scroll );
			webgl.addMesh(image);
		});

	}
}

window.addEventListener('DOMContentLoaded', function() {
	setTimeout(function() {
		new App();
	}, 500); // TODO: Fix google fonts loading delay
});
