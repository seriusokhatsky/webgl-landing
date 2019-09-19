import { TimelineMax, TweenLite } from 'gsap';
import Dispatcher from './dispatcher';

export default class Scroll extends Dispatcher {

	constructor() {
		super();
		this.position = 0;
		this.content = document.querySelectorAll('.scroll-content')[0];
		this.progressIdicator = document.querySelectorAll('.scroll-progress-indicator')[0];
		this.height = this.content.offsetHeight;
		this.windowHeight = window.innerHeight;
		this.progress = 0;
		this.events = [];
		this.animationTime = 1.3;

		window.addEventListener('mousewheel', this.onScroll.bind(this));
	}

	onScroll(e) {
		this.performScroll(e.deltaY);
	}

	performScroll(y) {

		console.log(y);

		if( this.position - y <= -this.height + this.windowHeight ) {
			this.position = -this.height + this.windowHeight;
		} else if( this.position - y >= 0 ) {
			this.position = 0;
		} else {
			this.position -= y;
		}
		this.updatePosition();

		this.dispatch('scroll', this.position);
	}

	updatePosition() {
		this.progress = -this.position / (this.height - this.windowHeight);

		this.scrollTo(this.position);
	}

	getPosition() {
		return this.position;
	}

	scrollTo(position) {
		var tl = new TimelineMax();
		var tl2 = new TimelineMax();
		tl.to(this.content, this.animationTime, { ease: Power4.easeOut, y:position } );

		tl2.to(this.progressIdicator, this.animationTime, { ease: Power4.easeOut, height: this.progress * this.windowHeight } );
	}
	
}