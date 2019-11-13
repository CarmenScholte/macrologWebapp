import { Component, OnInit, OnChanges, Renderer, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LogActivity } from '../../model/logActivity';
import { StoreActivityRequest } from '../../model/storeActivityRequest';
import { ActivityService } from '../../services/activity.service';

@Component({
	selector: 'log-activity',
	templateUrl: './log-activity.component.html'
})
export class LogActivityComponent implements OnInit, OnChanges {

	@ViewChild('logActivity', { static: false }) private logActivityEref: ElementRef;

	@Input() logActivities: LogActivity[];
	@Input() date: Date;
	@Input() open: boolean;
	@Input() syncAvailable: boolean;

	@Output() dataChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() forced: EventEmitter<boolean> = new EventEmitter<boolean>();

	public editable: boolean;
	public newActivityName: string;
	public addActivityCallBack: Function;
	public syncing = false;

	private pipe: DatePipe;

	constructor(private activityService: ActivityService) {
		this.editable = false;
		this.pipe = new DatePipe('en-US');
	}

	ngOnInit() {
		this.addActivityCallBack = this.addActivity.bind(this);
	}

	ngOnChanges(changes) {
		if (changes['date'] && this.editable) {
			this.saveAndClose();
		} else if (changes['open'] && !changes['open'].firstChange) {
			if (changes['open'].currentValue) {
				this.editable = true;
			} else {
				this.saveAndClose();
			}
		}
	}

	public showSync() {
		return this.syncAvailable && !this.syncing;
	}

	public forceSync() {
		this.syncing = true;
		this.forced.emit(true);
		this.syncing = false;

	}

	public close() {
		this.editable = false;
	}

	public addActivity() {
		if (this.newActivityName.length > 0) {
			this.logActivities.push({ id: null, day: this.date, name: this.newActivityName, calories: 0 });
		}
		this.newActivityName = null;
	}

	public deleteLogActivity(logActivity: LogActivity) {

		const index: number = this.logActivities.indexOf(logActivity);
		if (index !== -1) {
			this.logActivities.splice(index, 1);
		}

		this.activityService.deleteLogActivity(logActivity);
	}

	public saveAndClose() {
		this.close();
		const allEntries = [];
		for (const logActivity of this.logActivities) {
			const newRequest = new StoreActivityRequest();
			newRequest.id = logActivity.id;
			newRequest.name = logActivity.name;
			newRequest.calories = logActivity.calories;
			newRequest.syncedId = logActivity.syncedId;
			newRequest.syncedWith = logActivity.syncedWith;
			newRequest.day = this.pipe.transform(logActivity.day, 'yyyy-MM-dd');
			allEntries.push(newRequest);
		}
		const closeCallBack = () => {
			this.dataChanged.emit(true);
		};
		this.activityService.storeLogActivities(allEntries, closeCallBack);
	}
}
