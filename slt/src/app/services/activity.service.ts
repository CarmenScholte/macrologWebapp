import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StoreActivityRequest } from '../model/storeActivityRequest';
import { LogActivity } from '../model/logActivity';
import { environment } from '../../environments/environment';
import { AlertService } from './alert.service';

@Injectable()
export class ActivityService {

	private macrologBackendUrl = '//' + environment.backend + '/activities';

	constructor(private http: HttpClient,
		private alertService: AlertService) {
	}

	public getDayActivities(date: string) {
		return this.http.get<LogActivity[]>(this.macrologBackendUrl + '/day/' + date);
	}

	public getDayActivitiesForced(date: string) {
		return this.http.get<LogActivity[]>(this.macrologBackendUrl + '/day/' + date + '?forceSync=true');
	}

	public storeLogActivities(storeActivityRequest: StoreActivityRequest[], callBack: Function) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};
		const options = { headers: headers };
		return this.http.post<StoreActivityRequest[]>(this.macrologBackendUrl + '/', storeActivityRequest, options).subscribe(
			() => {
				this.alertService.setAlert('Your activities have been saved succesfully!', false);
				callBack();
			},
			error => {
				this.alertService.setAlert('Could not save activities: ' + error.error, true);
			});
	}

	public deleteLogActivity(logActivity: LogActivity) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};
		const options = { headers: headers };
		return this.http.delete<number>(this.macrologBackendUrl + '/' + logActivity.id, options).subscribe(
			() => {
				this.alertService.setAlert('Your activity has been deleted succesfully!', false);
			},
			error => {
				this.alertService.setAlert('Could not delete activity: ' + error.error, true);
			});
	}
}
