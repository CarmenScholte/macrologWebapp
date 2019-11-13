import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Food } from '../model/food';
import { environment } from '../../environments/environment';
import { AlertService } from './alert.service';

@Injectable()
export class FoodService {

	macrologBackendUrl = '//' + environment.backend + '/food';

	constructor(private http: HttpClient,
		private alertService: AlertService) {
	}

	public addFood(addFoodRequest: Food, callBack: Function) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};

		const options = { headers: headers };
		return this.http.post<Food>(this.macrologBackendUrl + '/', addFoodRequest, options).subscribe(
			() => {
				this.alertService.setAlert('Your food has been added succesfully!', false);
				callBack();
			},
			error => {
				this.alertService.setAlert('Could not add food: ' + error.error, true);
			});
	}

	public getFood(foodId: string) {
		return this.http.get<Food>(this.macrologBackendUrl + '/' + foodId, { responseType: 'json' });
	}

	public getAllFood() {
		return this.http.get<Food[]>(this.macrologBackendUrl, { responseType: 'json' });
	}
}
