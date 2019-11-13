import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LogEntry } from '../../model/logEntry';
import { StoreLogRequest } from '../../model/storeLogRequest';
import { DiaryService } from '../../services/diary.service';
import { FoodSearchable } from '../../model/foodSearchable';
import { Portion } from '@app/model/portion';
import { AlertService } from '@app/services/alert.service';

@Component({
	selector: 'log-meal',
	templateUrl: './log-meal.component.html',
	styleUrls: ['./log-meal.component.scss']
})
export class LogMealComponent implements OnInit, OnChanges {

	@ViewChild('logMeal', { static: false }) private logMealEref: ElementRef;

	@Input() searchables: FoodSearchable[];
	@Input() meal: string;
	@Input() logEntries: LogEntry[];
	@Input() date: Date;
	@Input() open: boolean;
	@Input() dummy = false;

	@Output() dataChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

	public editable: boolean;
	public addLogEntryCallBack: Function;
	public unitGrams = 100.00;
	public unitName = 'grams';
	private pipe: DatePipe;

	public closeCallBack = () => {
		this.dataChanged.emit(true);
	}

	constructor(private diaryService: DiaryService,
		private alertService: AlertService) {
		this.editable = false;
		this.pipe = new DatePipe('en-US');
	}

	ngOnInit() {
		this.addLogEntryCallBack = this.addLogEntry.bind(this);
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['date'] && this.editable) {
			this.saveAndClose();
		} else if (changes['open'] && !changes['open'].firstChange) {
			if (changes['open'].currentValue) {
				this.editable = true;
			} else {
				this.saveAndClose();
			}
		}
	}

	public close() {
		this.editable = false;
	}

	public setLogEntryMultiplier(event: any, logEntry: LogEntry) {
		if (event.data === '.') {
			return logEntry.multiplier;
		}
		if (!logEntry.portion) {
			logEntry.multiplier = (event.target.value / this.unitGrams);
		} else {
			logEntry.multiplier = event.target.value;
		}
		return logEntry.multiplier;
	}

	public getAmountValue(logEntry: LogEntry) {
		if (logEntry.portion) {
			return logEntry.multiplier;
		} else {
			return logEntry.multiplier * 100;
		}
	}

	public isGramsSelected(logEntry: LogEntry) {
		if (logEntry.portion === undefined) {
			return true;
		} else {
			return false;
		}
	}

	public isUnitSelected(logEntry: LogEntry, portion: Portion) {
		if (logEntry.portion !== undefined && logEntry.portion.description === portion.description) {
			return true;
		} else {
			return false;
		}
	}

	public copyPrevious() {
		if (!this.dummy) {
			const prevDay = new Date(this.date.getTime());
			prevDay.setDate(prevDay.getDate() - 1);
			const copyFrom = this.pipe.transform(prevDay, 'yyyy-MM-dd');

			for (const oldEntry of this.logEntries) {
				this.diaryService.deleteLogEntry(oldEntry);
				this.updateCalculatedMacros(oldEntry);
			}

			this.diaryService.getLogsForDay(copyFrom).subscribe(
				data => {
					const yesterdaysEntries = data;
					const filteredEntries = yesterdaysEntries.filter(
						entry => entry.meal === this.meal.toUpperCase()
					);
					for (const copiedEntry of filteredEntries) {
						const logEntry = new LogEntry();
						logEntry.meal = copiedEntry.meal;
						logEntry.food = copiedEntry.food;
						if (copiedEntry.portion) {
							logEntry.portion = copiedEntry.portion;
						}
						logEntry.multiplier = copiedEntry.multiplier;
						this.updateCalculatedMacros(logEntry);
						logEntry.day = this.date;
						this.logEntries.push(logEntry);
						this.updateCalculatedMacros(logEntry);
					}
					this.alertService.setAlert(this.meal + ' has been copied from ' + copyFrom, false);
				},
				() => {
					this.alertService.setAlert(this.meal + ' of ' + copyFrom + '  could not be copied', true);
				}
			);
		}
	}

	public amountChange(logEntry: LogEntry) {
		this.updateCalculatedMacros(logEntry);
	}

	public getAvailablePortions(logEntry: LogEntry) {
		for (const item of this.searchables) {
			if (item.food.id === logEntry.food.id) {
				return item.food.portions;
			}
		}
		return undefined;
	}

	public portionChange(logEntry: LogEntry, event: any) {
		if (event.target.value === this.unitName) {
			logEntry.portion = undefined;
			logEntry.multiplier = logEntry.multiplier / 100;
		} else {
			for (const portion of logEntry.food.portions) {
				if (portion.description === event.target.value) {
					if (logEntry.portion === undefined) {
						logEntry.multiplier = logEntry.multiplier * 100;
					}
					logEntry.portion = portion;
					break;
				}
			}
		}
		this.updateCalculatedMacros(logEntry);
	}

	updateCalculatedMacros(logEntry: LogEntry) {
		const protein = this.calculateProtein(logEntry);
		const carbs = this.calculateCarbs(logEntry);
		const fat = this.calculateFat(logEntry);
		const calories = (protein * 4) + (fat * 9) + (carbs * 4);
		logEntry.macrosCalculated = { protein: protein, fat: fat, carbs: carbs, calories: calories };
	}

	public addLogEntry(foodSearchable: FoodSearchable) {
		const food = foodSearchable.food;
		const dish = foodSearchable.dish;
		if (food !== undefined) {
			const logEntry = new LogEntry();
			logEntry.meal = this.meal.toUpperCase();
			logEntry.food = food;
			if (food.portions) {
				logEntry.portion = food.portions[0];
				logEntry.multiplier = 1; // 1 * 1st selected portion
			} else {
				logEntry.multiplier = 1; // 1* 100 grams
			}
			this.updateCalculatedMacros(logEntry);
			logEntry.day = this.date;
			this.logEntries.push(logEntry);
		} else if (dish !== undefined) {
			for (const ingredient of dish.ingredients) {
				const logEntry = new LogEntry();
				logEntry.meal = this.meal.toUpperCase();
				logEntry.food = ingredient.food;
				logEntry.multiplier = ingredient.multiplier;
				if (ingredient.portionId) {
					for (const portion of ingredient.food.portions) {
						if (portion.id === ingredient.portionId) {
							logEntry.portion = portion;
							break;
						}
					}
				}
				this.updateCalculatedMacros(logEntry);
				logEntry.day = this.date;
				this.logEntries.push(logEntry);
			}
		}
	}

	private calculateProtein(logEntry: LogEntry) {
		if (logEntry.portion !== undefined) {
			return (logEntry.multiplier * logEntry.portion.macros.protein);
		} else {
			return (logEntry.multiplier * logEntry.food.protein);
		}
	}

	private calculateFat(logEntry: LogEntry) {
		if (logEntry.portion) {
			return (logEntry.multiplier * logEntry.portion.macros.fat);
		} else {
			return (logEntry.multiplier * logEntry.food.fat);
		}
	}

	private calculateCarbs(logEntry: LogEntry) {
		if (logEntry.portion) {
			return (logEntry.multiplier * logEntry.portion.macros.carbs);
		} else {
			return (logEntry.multiplier * logEntry.food.carbs);
		}
	}

	public deleteLogEntry(logEntry: LogEntry) {
		if (!this.dummy) {
			const index: number = this.logEntries.indexOf(logEntry);
			if (index !== -1) {
				this.logEntries.splice(index, 1);
			}
			this.diaryService.deleteLogEntry(logEntry);
		}
	}

	public saveAndClose() {
		this.close();
		const allEntries = [];
		for (const logEntry of this.logEntries) {
			const newRequest = new StoreLogRequest();
			newRequest.id = logEntry.id;
			newRequest.foodId = logEntry.food.id;
			if (logEntry.portion) {
				newRequest.portionId = logEntry.portion.id;
			}
			newRequest.multiplier = logEntry.multiplier;
			newRequest.day = this.pipe.transform(logEntry.day, 'yyyy-MM-dd');
			newRequest.meal = this.meal.toUpperCase();
			allEntries.push(newRequest);
		}
		if (!this.dummy) {
			this.diaryService.storeLogEntries(allEntries, this.closeCallBack);
		} else {
			this.alertService.setAlert('Your meals have been saved!', false);
		}
	}
}
