import { Component, OnInit, OnChanges, ViewChild, SimpleChanges, ElementRef, Input } from '@angular/core';

@Component({
	selector: 'bargraph',
	templateUrl: './bargraph.component.html'
})
export class BargraphComponent implements OnInit, OnChanges {

	@ViewChild('trackFill') private trackFillElement: ElementRef;

	@Input() percentage: number;
	@Input() title: string;

	public trackFill;

	constructor() { }

	ngOnInit() {
		const percentCap = this.percentage > 115 ? 115 : this.percentage;
		const hueDegree = this.calcHue(percentCap);
		this.trackFill = this.trackFillElement.nativeElement;
		this.trackFill.style.width = percentCap + '%';
		this.trackFill.style.filter = 'hue-rotate(' + hueDegree + 'deg)';
	}

	onChange() {
		const percentCap = this.percentage > 115 ? 115 : this.percentage;
		const hueDegree = this.calcHue(percentCap);
		this.trackFill = this.trackFillElement.nativeElement;
		this.trackFill.style.width = percentCap + '%';
		this.trackFill.style.filter = 'hue-rotate(' + hueDegree + 'deg)';
	}

	ngOnChanges() {
		this.onChange();
	}

	calcHue(percent: number): number {
		// 115%  50   = -120deg;
		// 100%  0    = 0deg;
		// 50%   -50  = 120deg;
		if (percent > 100) {
			const deg = (percent - 100) * -8;
			return deg;
		} else {
			const deg = (percent - 100) * -2.4;
			return deg;
		}
	}
}
