import {Component, OnInit, OnChanges, SimpleChanges, Input }from '@angular/core';
import {UserService} from '../../services/user.service';
import {Gender} from '../../model/gender';
import {Observable} from 'rxjs/Observable';
import {forkJoin} from 'rxjs/observable/forkJoin';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

	public name: string;
	public age: number;
	public gender: Gender;
	public height: number;
	public weight: number;
	public activity: number;

	public showCalcModal: boolean = false;

	public goalProtein: string;
	public goalFat: string;
	public goalCarbs: string;

  constructor(private userService: UserService) {

	}

  ngOnInit() {
		this.userService.getAllSettings().subscribe(
			result => {
			 this.name = this.getKeyFromResultlist(result, 'name');
			 this.age = parseInt(this.getKeyFromResultlist(result, 'age')) || undefined ;
       this.gender = this.getKeyFromResultlist(result, 'gender') || Gender.Male;
			 this.height = parseInt(this.getKeyFromResultlist(result, 'height')) || undefined;
			 this.weight = parseInt(this.getKeyFromResultlist(result, 'weight')) || undefined;
			 this.activity = parseFloat(this.getKeyFromResultlist(result, 'activity')) || 1.2;
			 this.setGoalMacros(result);
			 },
			error => { console.log(error) }
		);
	}

	setGoalMacros(result) {
		this.goalProtein = this.getKeyFromResultlist(result, 'goalProtein');
		this.goalFat = this.getKeyFromResultlist(result, 'goalFat');
		this.goalCarbs = this.getKeyFromResultlist(result, 'goalCarbs');
	}

	openCalcModal(): void {
		this.showCalcModal = true;
	}

	closeCalcModal(event): void {
		console.log(event);
		this.goalProtein = event.goalProtein ? event.goalProtein : this.goalProtein;
		this.goalFat = event.goalFat ? event.goalFat : this.goalFat;
		this.goalCarbs = event.goalCarbs ? event.goalCarbs : this.goalCarbs;
		this.showCalcModal = false;
	}

	public saveUserSettings(): void {
    forkJoin(
			this.userService.addUserInfo('name', this.name),
			this.userService.addUserInfo('age', this.age.toString()),
			this.userService.addUserInfo('gender', this.gender.toString()),
			this.userService.addUserInfo('height', this.height.toString()),
			this.userService.addUserInfo('weight', this.weight.toString()),
			this.userService.addUserInfo('activity', this.activity.toString())
    ).subscribe(

//TODO: Toast melding voor het succesvol opslaan maken
        data => console.log(data),
        error => console.error(error)
    );
	}

	private getKeyFromResultlist(list: any, key: string) {
		for (let item of list) {
			if (item.name === key) {
				return item.value;
			}
		}
		return '';
	}

}
