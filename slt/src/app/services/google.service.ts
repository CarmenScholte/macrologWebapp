import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ConnectivityStatus } from '@app/model/connectivityStatus';
import { ConnectivityRequest } from '@app/model/connectivityRequest';
import { MailRequest } from '@app/model/mailRequest';

@Injectable()
export class GoogleService {

	private macrologBackendUrl = '//' + environment.backend + '/admin/mail';

	constructor(private http: HttpClient) { }

	public getStatus() {
		return this.http.get<ConnectivityStatus>(this.macrologBackendUrl + '/status', { responseType: 'json' });
	}

	public storeMailSyncSettings(code: string) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};

		const connectivityRequest = new ConnectivityRequest(code);
		const options = { headers: headers };
		return this.http.post<ConnectivityRequest>(this.macrologBackendUrl, connectivityRequest, options);
	}

	public sendTestMail(mailAddress: string) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};
		const mailRequest = new MailRequest(mailAddress);
		const options = { headers: headers };
		return this.http.post(this.macrologBackendUrl + '/testmail', mailRequest, options);
	}
}
