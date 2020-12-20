import { Component, OnInit, AfterViewInit, Output, Renderer2, EventEmitter, ElementRef, ViewChildren, QueryList, Input } from '@angular/core';

@Component({
	selector: 'datepicker',
	templateUrl: './datepicker.component.html',
	styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements AfterViewInit, OnInit {

	@ViewChildren('dayRef') dayRefs: QueryList<any>;

	@Input() arrows = true;

	@Input() startDate: Date;

	@Output() change = new EventEmitter<Date>();

	public dateformat = 'dd-MM-yyyy';
	public today: Date;
	public selectedDate: Date;
	public daysInMonth: number;
	public daysInMonthArray = new Array();
	public weekdays = new Array();
	public placeholders = new Array();
	public isOpen = false;

	constructor(private renderer: Renderer2) {
		this.today = new Date();
		this.selectedDate = new Date();
	}

	ngOnInit() {
		if (this.startDate) {
			this.selectedDate = this.startDate;
		}
		this.setDaysInMonthArray();
		this.setWeekdays();
		this.getWeekdayPlaceholders();
	}

	ngAfterViewInit() {
		this.dayRefs.changes.subscribe(changes => {
			changes.toArray().forEach(item => {
				this.removeMark(item);
				this.markIfToday(item);
			});
		});
	}

	public toggleOpen() {
		this.isOpen = !this.isOpen;
	}

	public nextDay() {
		this.selectedDate = new Date(this.selectedDate.getFullYear(),
			this.selectedDate.getMonth(), this.selectedDate.getDate() + 1);
		this.setDaysInMonthArray();
		this.getWeekdayPlaceholders();
		this.change.emit(this.selectedDate);
	}

	public previousDay() {
		this.selectedDate = new Date(this.selectedDate.getFullYear(),
			this.selectedDate.getMonth(), this.selectedDate.getDate() - 1);
		this.setDaysInMonthArray();
		this.getWeekdayPlaceholders();
		this.change.emit(this.selectedDate);
	}

	public nextMonth() {
		this.selectedDate = new Date(this.selectedDate.getFullYear(),
			this.selectedDate.getMonth() + 1, 1);
		this.setDaysInMonthArray();
		this.getWeekdayPlaceholders();
		this.ngAfterViewInit();
	}

	public previousMonth() {
		this.selectedDate = new Date(this.selectedDate.getFullYear(),
			this.selectedDate.getMonth() - 1, 1);
		this.setDaysInMonthArray();
		this.getWeekdayPlaceholders();
		this.ngAfterViewInit();
	}

	public selectDay(day: number) {
		this.selectedDate = new Date(this.selectedDate.getFullYear(),
			this.selectedDate.getMonth(), day);
		this.isOpen = false;
		this.change.emit(this.selectedDate);
	}

	private setDaysInMonthArray() {
		this.daysInMonthArray = new Array();
		this.daysInMonth = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 0).getDate();
		for (let i = 1; i <= this.daysInMonth; i++) {
			this.daysInMonthArray.push(i);
		}
	}

	private setWeekdays() {
		this.weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	}

	private getWeekdayPlaceholders() {
		this.placeholders = new Array();
		const firstOfMonth = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1);
		const dayOfWeek = firstOfMonth.getDay();

		for (let i = 0; i < dayOfWeek; i++) {
			this.placeholders.push(i);
		}
	}

	private markIfToday(item: ElementRef) {
		if (this.selectedDate.getMonth() === this.today.getMonth()) {
			if (item.nativeElement.textContent === this.selectedDate.getDate()) {
				this.renderer.addClass(item.nativeElement, 'picker__day--today');
			}
		}
	}

	private removeMark(item) {
		if (item.nativeElement.classList.contains('picker__day--today')) {
			this.renderer.removeClass(item.nativeElement, 'picker__day--today');
		}
	}
}
