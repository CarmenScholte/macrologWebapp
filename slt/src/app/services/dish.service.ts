import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dish } from '../model/dish';
import { StoreDishRequest } from '../model/storeDishRequest';
import { environment } from '../../environments/environment';
import { AlertService } from './alert.service';

@Injectable()
export class DishService {

	private macrologBackendUrl = '//' + environment.backend + '/dishes';

	constructor(private http: HttpClient,
		private alertService: AlertService) {
	}

	public getAllDishes() {
		return this.http.get<Dish[]>(this.macrologBackendUrl, { responseType: 'json' });
	}

	public insertDish(storeDishRequest: StoreDishRequest, callBack: Function) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};

		const options = { headers: headers };
		return this.http.post<StoreDishRequest>(this.macrologBackendUrl + '/', storeDishRequest, options).subscribe(
			() => {
				this.alertService.setAlert('Your dish has been saved succesfully!', false);
				callBack();
			},
			error => {
				this.alertService.setAlert('Could not save dish: ' + error.error, true);
			});
	}

	public deleteDish(dish: Dish, callBack: Function) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};

		const options = { headers: headers };
		return this.http.delete<number>(this.macrologBackendUrl + '/' + dish.id, options).subscribe(
			() => {
				this.alertService.setAlert('Your dish has been deleted succesfully!', false);
				callBack();
			},
			error => {
				this.alertService.setAlert('Could not delete dish: ' + error.error, true);
			});
	}
}
