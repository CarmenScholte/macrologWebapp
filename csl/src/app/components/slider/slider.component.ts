import{Component, OnInit, OnChanges, Inject, ViewChild, ElementRef, Input, Output, EventEmitter, SimpleChanges}from '@angular/core';

@Component({
  selector: 'slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

	@ViewChild('slider') private sliderElement: ElementRef;
  @ViewChild('sliderHandle') private handleElement: ElementRef;
	@ViewChild('trackFill') private trackElement: ElementRef;

	@Input() value;
	@Input() upperBound;
	@Input() lowerBound;

	@Output() valueChange: EventEmitter<number> = new EventEmitter<number>();

	private mouseDown = false;
	private oldXChord: number;
	private newXChord: number;
	private slider;
	private sliderHandle;
	private track;
	private boundary;

	private sliderOffsetLeft;
	private sliderOffsetRight;
	private sliderWidth;

  constructor() { }

  ngOnInit() {
		this.slider = this.sliderElement.nativeElement;
		this.sliderHandle = this.handleElement.nativeElement;
		this.track = this.trackElement.nativeElement;

		this.sliderWidth = this.slider.clientWidth;
		this.sliderOffsetLeft = this.getOffsetLeft(this.slider);
		this.sliderOffsetRight = this.sliderOffsetLeft + this.sliderWidth;

		this.boundary = {
			left: this.sliderOffsetLeft,
			right: this.sliderOffsetRight
		};
		this.initHandle();
  }

	ngOnChanges(changes: SimpleChanges) {
		this.value = changes.value.currentValue;
		this.initHandle();
	}

	private initHandle() {
		let part = this.value - this.lowerBound;
		let percentage = part / (this.upperBound - this.lowerBound);

		if (this.sliderHandle && this.track) {
			this.sliderHandle.style.left = (this.sliderWidth * percentage) - (this.sliderHandle.clientWidth / 2) + 'px';
			this.track.style.width = (this.sliderWidth * percentage) + 'px';
		}
	}

	private calculateValue() {
		let total = this.upperBound - this.lowerBound;
		this.value = (total * (this.newXChord / this.sliderWidth)) + this.lowerBound;
		this.valueChange.emit(this.value);
	}

	// Mouse and touch behaviour
	public onDown(event) {
		event.preventDefault(); // prevent mouseclick when mobile, good practice
		this.mouseDown = true;
		this.onClick(event);
	}

	public onUp(event) {
		this.sliderHandle.style.transition = 'left 0.3s';
		this.track.style.transition = 'width 0.3s';
		this.mouseDown = false;
	}

	public onMove(event): void {
		event.preventDefault();
		let location = this.getMouseLocation(event);

		if (this.mouseDown && this.isInBoundary(location)) {
			this.newXChord = location - this.sliderOffsetLeft;
			let distance = this.oldXChord - this.newXChord;
			this.oldXChord = this.newXChord;
			this.sliderHandle.style.left = (this.sliderHandle.offsetLeft - distance) + 'px';
			this.sliderHandle.style.transition = 'none';
			this.track.style.width = (this.track.offsetWidth - distance) + 'px';
			this.track.style.transition = 'none';
			this.calculateValue();
		} else {
			//dragging out of boundary
			this.mouseDown = false;
		}
	}

	public onClick(event): void {
		event.preventDefault();
		let location = this.getMouseLocation(event);
		if (this.isInBoundary(location)) {
			this.newXChord = location - this.boundary.left;
			this.sliderHandle.style.left = (this.newXChord - (this.sliderHandle.clientWidth / 2)) + 'px';
			this.track.style.width = this.newXChord + 'px';

			this.calculateValue();
		}
	}

	private isInBoundary(location: number) {
		return (location >= this.boundary.left && location <= (this.boundary.right));
	}

	private getMouseLocation(event): number {
		let location;
		if (event.touches !== undefined) {
			location = event.touches[0].clientX; // mobile is different apparently
		} else {
			location = event.clientX;
		}
		return location;
	}

	private getOffsetLeft(slider) {
    let offsetLeft = 0;
    do {
      if ( !isNaN( slider.offsetLeft ) ) {
				offsetLeft += slider.offsetLeft;
      }
    } while( slider = slider.offsetParent );
    return offsetLeft;
	}

}
