import { Component, OnInit, ViewChild } from '@angular/core';
import { DiaryService } from '../../../services/diary.service';
import { ActivityService } from '../../../services/activity.service';
import { UserService } from '../../../services/user.service';
import { FoodService } from '../../../services/food.service';
import { DishService } from '../../../services/dish.service';
import { LogEntry } from '../../../model/logEntry';
import { LogActivity } from '../../../model/logActivity';
import { FoodSearchable } from '../../../model/foodSearchable';
import { DatePipe } from '@angular/common';
import { Dish } from '@app/model/dish';
import { Food } from '@app/model/food';
import { AlertService } from '@app/services/alert.service';

@Component({
	selector: 'diary-page',
	templateUrl: './diary.component.html',
	styleUrls: ['./diary.component.scss'],
	host: { '(document: click)': 'documentClick($event)' }
})
export class DiaryComponent implements OnInit {

	@ViewChild('breakfast', { static: false }) private breakfastEref;
	@ViewChild('lunch', { static: false }) private lunchEref;
	@ViewChild('dinner', { static: false }) private dinnerEref;
	@ViewChild('snacks', { static: false }) private snacksEref;
	@ViewChild('activities', { static: false }) private activitiesEref;

	public modalIsVisible = false;
	public isLogMealOpen: boolean;
	public allLogs: LogEntry[];
	public food: Food[];
	public dishes: Dish[];
	public searchableFood: FoodSearchable[];
	public displayDate: Date;
	private pipe: DatePipe;

	public breakfastLogs = new Array<LogEntry>();
	public lunchLogs = new Array<LogEntry>();
	public dinnerLogs = new Array<LogEntry>();
	public snacksLogs = new Array<LogEntry>();
	public activitiesLogs = new Array<LogActivity>();

	public breakfastOpen = false;
	public lunchOpen = false;
	public dinnerOpen = false;
	public snacksOpen = false;
	public activitiesOpen = false;

	public activititiesSync = false;
	public intakeGoals;
	public goalCal: number;
	public circleRadius = 60;
	public strokeWidth = 8;

	constructor(private foodService: FoodService,
		private userService: UserService,
		private alertService: AlertService,
		private logService: DiaryService,
		private activityService: ActivityService,
		private dishService: DishService) {
		this.displayDate = new Date();
		this.pipe = new DatePipe('en-US');
	}

	ngOnInit() {
		this.getSyncSettings();
		this.getUserGoals(this.pipe.transform(this.displayDate, 'yyyy-MM-dd'));
		this.getAllFood();
		this.getLogEntries(this.pipe.transform(this.displayDate, 'yyyy-MM-dd'));
		if (window.innerWidth < 480) {
			this.circleRadius = 40;
			this.strokeWidth = 5;
		}
	}

	public refresh() {
		this.getLogEntries(this.pipe.transform(this.displayDate, 'yyyy-MM-dd'));
	}

	public forceSync() {
		this.activityService.getDayActivitiesForced(this.pipe.transform(this.displayDate, 'yyyy-MM-dd')).subscribe(
			data => {
				this.activitiesLogs = data;
			},
			error => {
				this.activitiesLogs = new Array();
			}
		);
	}

	public getTotal(macro: string) {
		let total = 0.0;
		for (const logentry of this.breakfastLogs) {
			total += logentry.macrosCalculated[macro];
		}
		for (const logentry of this.lunchLogs) {
			total += logentry.macrosCalculated[macro];
		}
		for (const logentry of this.dinnerLogs) {
			total += logentry.macrosCalculated[macro];
		}
		for (const logentry of this.snacksLogs) {
			total += logentry.macrosCalculated[macro];
		}
		return total;
	}

	public getDifferentDay(event: any) {
		this.displayDate = event;
		this.breakfastOpen = false;
		this.lunchOpen = false;
		this.dinnerOpen = false;
		this.snacksOpen = false;
		this.activitiesOpen = false;
		this.getUserGoals(this.pipe.transform(this.displayDate, 'yyyy-MM-dd'));
		this.getLogEntries(this.pipe.transform(this.displayDate, 'yyyy-MM-dd'));
	}

	public openModal() {
		this.modalIsVisible = true;
	}

	public closeModal() {
		this.modalIsVisible = false;
		this.getAllFood();
	}

	private getUserGoals(date: string) {
		this.userService.getUserGoalStats(date).subscribe(
			data => {
				if (data[0] === null) {
					this.intakeGoals = null;
				} else {
					this.intakeGoals = data;
				}
				this.setGoalCal();
			},
			error => {
				this.alertService.setAlert('Could not get usergoal stats: ' + error.error, true);
			}
		);
	}

	private getSyncSettings() {
		this.userService.getSyncSettings('STRAVA').subscribe(
			result => {
				if (result.syncedAccountId) {
					this.activititiesSync = true; // TODO --> GET THIS TO ACTIVITIES PAGE TO ENABLE SYNC BUTTON
				}
			},
			error => {
				this.alertService.setAlert('Could not get sync settings for strava: ' + error.error, true);
			}
		);
	}

	private getAllFood() {
		this.foodService.getAllFood().subscribe(
			data => {
				this.food = data;
				this.getAllDishes();
			},
			error => {
				this.alertService.setAlert('Could not get all food: ' + error.error, true);
			}
		);
	}

	private getAllDishes() {
		this.dishService.getAllDishes().subscribe(
			data => {
				this.dishes = data;
				this.getFoodSearchableList();
			},
			error => {
				this.alertService.setAlert('Could not get all dishes: ' + error.error, true);
			}
		);
	}

	private getLogEntries(date: string) {
		this.logService.getLogsForDay(date).subscribe(
			data => {
				this.allLogs = data;
				this.breakfastLogs = new Array();
				this.breakfastLogs = this.allLogs.filter(
					entry => entry.meal === 'BREAKFAST'
				);
				this.lunchLogs = new Array();
				this.lunchLogs = this.allLogs.filter(
					entry => entry.meal === 'LUNCH'
				);
				this.dinnerLogs = new Array();
				this.dinnerLogs = this.allLogs.filter(
					entry => entry.meal === 'DINNER'
				);
				this.snacksLogs = new Array();
				this.snacksLogs = this.allLogs.filter(
					entry => entry.meal === 'SNACKS'
				);
			},
			error => {
				this.alertService.setAlert('Could not get all log entries: ' + error.error, true);
				this.allLogs = new Array();
				this.breakfastLogs = new Array();
				this.lunchLogs = new Array();
				this.dinnerLogs = new Array();
				this.snacksLogs = new Array();
				this.activitiesLogs = new Array();
			}
		);

		this.activityService.getDayActivities(date).subscribe(
			data => {
				this.activitiesLogs = data;
			},
			error => {
				this.activitiesLogs = new Array();
				this.alertService.setAlert('Could not get all activities: ' + error.error, true);
			}
		);

	}

	private getFoodSearchableList() {
		const searchables: Array<FoodSearchable> = [];

		for (const item of this.food) {
			const searchable = new FoodSearchable(item);
			searchables.push(searchable);
		}
		for (const dish of this.dishes) {
			searchables.push(new FoodSearchable(undefined, dish));
		}

		this.searchableFood = searchables;
	}

	private setGoalCal() {
		if (this.intakeGoals) {
			this.goalCal = (this.intakeGoals[0] * 4)
				+ (this.intakeGoals[1] * 9)
				+ (this.intakeGoals[2] * 4);
		}
	}

	private documentClick(event: any) {
		if (!event.target.classList.contains('autocomplete__option') &&
			!event.target.classList.contains('trash') &&
			!event.target.classList.contains('button--delete') &&
			!event.target.classList.contains('activity__name--sync') &&
			!event.target.classList.contains('activity__title--sync')) {

			this.breakfastOpen = this.breakfastEref.logMealEref.nativeElement.contains(event.target);
			this.lunchOpen = this.lunchEref.logMealEref.nativeElement.contains(event.target);
			this.dinnerOpen = this.dinnerEref.logMealEref.nativeElement.contains(event.target);
			this.snacksOpen = this.snacksEref.logMealEref.nativeElement.contains(event.target);
			this.activitiesOpen = this.activitiesEref.logActivityEref.nativeElement.contains(event.target);
		}
	}
}
