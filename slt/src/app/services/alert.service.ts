import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AlertService {

	private alert: Subject<Alert>;

	public alertObservable: Observable<Alert>;

	constructor() {
		this.alert = new Subject<Alert>();
		this.alertObservable = this.alert.asObservable();
	}

	public setAlert(message: string, isError: boolean) {
		this.alert.next(new Alert(message, isError));
	}
}

export class Alert {
	public message: string;
	public isError: boolean;

	constructor(message: string, isError: boolean) {
		this.message = message;
		this.isError = isError;
	}
}
