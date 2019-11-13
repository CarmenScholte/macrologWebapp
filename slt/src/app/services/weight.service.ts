import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Weight } from '../model/weight';
import { environment } from '../../environments/environment';
import { AlertService } from './alert.service';

@Injectable()
export class WeightService {

	macrologBackendUrl = '//' + environment.backend + '/weight';
	activities = new Array();

	constructor(private http: HttpClient,
		private alertService: AlertService) {
	}

	public getAllWeights() {
		return this.http.get<Weight[]>(this.macrologBackendUrl, { responseType: 'json' });
	}
	public getDayActivities(date: string) {
		return this.http.get<any[]>(this.macrologBackendUrl + '/day/' + date);
	}

	public storeWeight(logWeight: Weight, callBack: Function) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};

		const options = { headers: headers };
		return this.http.post<Weight>(this.macrologBackendUrl + '/', logWeight, options).subscribe(
			() => {
				this.alertService.setAlert('Your weight has been saved succesfully!', false);
				callBack();
			},
			error => {
				this.alertService.setAlert('Could not save weight: ' + error.error, true);
			});
	}

	public deleteWeight(logWeight: Weight, callBack: Function) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};

		const options = { headers: headers };

		return this.http.delete<number>(this.macrologBackendUrl + '/' + logWeight.id, options).subscribe(
			() => {
				this.alertService.setAlert('Your weight measurement was deleted succesfully!', false);
				callBack();
			},
			error => {
				this.alertService.setAlert('Could not delete weight measurement: ' + error.error, true);
			});
	}
}
