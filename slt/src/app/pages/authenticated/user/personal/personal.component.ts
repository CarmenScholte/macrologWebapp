import { Component } from '@angular/core';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { UserService } from '../../../../services/user.service';
import { Gender } from '../../../../model/gender';
import * as moment from 'moment';
import { UserSettings } from '@app/model/userSettings';
import { AlertService } from '@app/services/alert.service';

@Component({
	selector: 'personal',
	styleUrls: ['./personal.component.scss'],
	templateUrl: './personal.component.html'
})
export class PersonalComponent {

	private originalResult: UserSettings;

	public name: string;
	public birthday: string;
	public gender: Gender;
	public height: number;
	public weight: number;
	public activity: number;
	public newWeight: number;

	constructor(private userService: UserService,
		private alertService: AlertService) {
		this.userService.getUserSettings().subscribe(
			result => {
				this.originalResult = result;
				this.name = result.name;
				this.birthday = moment(result.birthday, 'YYYY-M-D', true).format('DD-MM-YYYY');
				this.gender = result.gender || Gender.Male;
				this.height = result.height;
				this.weight = result.currentWeight;
				this.activity = result.activity;
				this.newWeight = this.weight;
			},
			error => {
				this.alertService.setAlert('Could not get all user settings: ' + error.error, true);
			}
		);
	}

	public saveUserSettings(): void {
		forkJoin(
			this.userService.addUserSetting('name', this.name),
			this.userService.addUserSetting('birthday', this.birthday.toString()),
			this.userService.addUserSetting('gender', this.gender.toString()),
			this.userService.addUserSetting('height', this.height.toString()),
			this.userService.addUserSetting('weight', this.weight.toString()),
			this.userService.addUserSetting('activity', this.activity.toString())
		).subscribe(
			() => this.alertService.setAlert('Your data was saved succesfully!', false),
			error => this.alertService.setAlert('Could not save data: ' + error.error, true)
		);
	}

	public isInputUnchanged(): boolean {
		if (this.originalResult !== undefined) {
			if (this.name === this.originalResult.name
				&& this.birthday === this.originalResult.birthday
				&& this.gender === this.originalResult.gender
				&& this.height === this.originalResult.height
				&& this.weight === this.originalResult.currentWeight
				&& this.activity === this.originalResult.activity
			) {
				return true;
			}
		}
		return false;
	}

}
