import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StoreLogRequest } from '../model/storeLogRequest';
import { LogEntry } from '../model/logEntry';
import { environment } from '../../environments/environment';
import { MacrosPerDay } from '@app/model/macrosPerDay';
import { AlertService } from './alert.service';


@Injectable()
export class DiaryService {

	macrologBackendUrl = '//' + environment.backend + '/logs';

	constructor(private http: HttpClient,
		private alertService: AlertService) {
	}

	public getLogsForDay(date: string) {
		return this.http.get<LogEntry[]>(this.macrologBackendUrl + '/day/' + date);
	}

	public getMacrosPerDay(dateFrom: string, dateTo: string) {
		return this.http.get<MacrosPerDay[]>(this.macrologBackendUrl + '/macros', { params: { from: dateFrom, to: dateTo }, responseType: 'json' });
	}

	public storeLogEntries(storeLogEntryRequest: StoreLogRequest[], callBack: Function) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};

		const options = { headers: headers };
		return this.http.post<StoreLogRequest[]>(this.macrologBackendUrl + '/', storeLogEntryRequest, options).subscribe(
			() => {
				this.alertService.setAlert('Your meals have been saved!', false);
				callBack();
			},
			error => {
				this.alertService.setAlert('Your meals could not be saved: ' + error.error, true);
			});
	}

	public deleteLogEntry(logEntry: LogEntry) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};

		const options = { headers: headers };
		return this.http.delete<number>(this.macrologBackendUrl + '/' + logEntry.id, options).subscribe(
			() => {
				this.alertService.setAlert('Your entry was deleted successfully!', false);
			},
			error => {
				this.alertService.setAlert('Your entry has not been deleted: ' + error.error, true);
			});
	}
}
