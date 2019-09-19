export default class Cursor {
	constructor() {

		var cursor = document.getElementsByClassName('cursor')[0];
		var body = document.getElementsByTagName('body')[0];

		var width = parseFloat(getComputedStyle(cursor, null).width.replace("px", ""))
		var height = parseFloat(getComputedStyle(cursor, null).height.replace("px", ""))

		var x = 0;
		var y = 0;

		var x1 = -1;
		var y1 = -1;
		var dx = 0;
		var dy = 0;

		body.addEventListener('mouseenter', (e) => {
			cursor.style.display = 'block';
			x1 = e.clientX - width/2;
			y1 = e.clientY - height/2;	
			console.log(x1, y1);	
		});

		body.addEventListener('mousemove', (e) => {
			cursor.style.display = 'block';
			x = e.clientX - width/2;
			y = e.clientY - height/2;		

			if( x1 < 0 ) {
				x1 = x;
				y1 = y;
			}
		});
		body.addEventListener('mouseleave', (e) => {
			cursor.style.display = 'none';
		});

		const render = () => {	
			dx = (x - x1) * .8;
			dy = (y - y1) * .8;
			x1 = x - dx;
			y1 = y - dy;

			TweenMax.set(cursor, {
			  x: x1,
			  y: y1
			});
			
			requestAnimationFrame(render);
		};

		requestAnimationFrame(render);
	}
}