import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Dish } from '../../model/dish';
import { Ingredient } from '../../model/ingredient';
import { FoodSearchable } from '../../model/foodSearchable';
import { FoodService } from '../../services/food.service';
import { DishService } from '../../services/dish.service';
import { Food } from '@app/model/food';
import { AlertService } from '@app/services/alert.service';

@Component({
	selector: 'make-dish-modal',
	templateUrl: './make-dish-modal.component.html',
	styleUrls: ['./make-dish-modal.component.scss']
})
export class MakeDishModalComponent implements OnInit {

	@Input() selectedDish: Dish;

	@Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

	public modalTitle = 'Make a dish';
	public dishName = '';
	public food: Food[];
	public searchables: FoodSearchable[] = new Array();
	public addIngredientCallBack: Function;
	public ingredients: Ingredient[] = new Array();

	private unitName = 'gram';
	private unitGrams = 100.00;

	constructor(private foodService: FoodService,
		private alertService: AlertService,
		private dishService: DishService) {
	}

	ngOnInit() {
		this.loadDishFromInput();
		this.getAllFood();
		this.addIngredientCallBack = this.addIngredient.bind(this);
	}

	private getAllFood() {
		this.foodService.getAllFood().subscribe(
			data => {
				this.food = data;
				this.getFoodSearchableList();
			},
			error => {
				this.alertService.setAlert('Could not get all food: ' + error.error, true);
			}
		);
	}

	private getFoodSearchableList() {
		const foodList = new Array();
		for (const item of this.food) {
			const searchable = new FoodSearchable(item);
			foodList.push(searchable);
		}
		this.searchables = foodList;
	}

	public getAvailablePortions(ingredient: Ingredient) {
		for (const item of this.searchables) {
			if (item.food.id === ingredient.food.id) {
				return item.food.portions;
			}
		}
		return undefined;
	}

	public portionChange(ingredient: Ingredient, eventTarget: any) {
		if (eventTarget.value === this.unitName) {
			ingredient.portion = undefined;
		} else {
			for (const portion of ingredient.food.portions) {
				if (portion.description === eventTarget.value) {
					ingredient.portion = portion;
					break;
				}
			}
		}
		ingredient.multiplier = 1;
	}

	private addIngredient(foodSearchable: FoodSearchable) {
		const ingredient = new Ingredient();
		ingredient.food = foodSearchable.food;
		this.ingredients.push(ingredient);
	}

	public removeIngredient(index: number) {
		this.ingredients.splice(index, 1);
	}

	public calculateMultiplier(event: any, ingredient: Ingredient) {
		if (ingredient.portion === undefined) {
			ingredient.multiplier = (event.target.value / this.unitGrams);
		} else {
			ingredient.multiplier = event.target.value;
		}
	}

	public getValue(ingredient: Ingredient) {
		if (ingredient.portion === undefined) {
			return Math.round(this.unitGrams * ingredient.multiplier);
		} else {
			return ingredient.multiplier;
		}
	}

	public getStep(ingredient: Ingredient) {
		if (ingredient.portion === undefined) {
			return 1;
		} else {
			return 0.1;
		}
	}

	private loadDishFromInput() {
		if (this.selectedDish) {
			this.modalTitle = 'Edit a dish';
			this.dishName = this.selectedDish.name;
			this.ingredients = this.selectedDish.ingredients;

			for (const ingredient of this.ingredients) {
				for (const portion of ingredient.food.portions) {
					if (portion.id === ingredient.portionId) {
						ingredient.portion = portion;
					}
				}
			}
		}
	}

	public saveDish() {
		const dish = new Dish(this.dishName);
		if (this.selectedDish) {
			dish.id = this.selectedDish.id;
		}
		dish.ingredients = this.ingredients;
		const self = this;
		const closeCallBack = () => {
			self.closeModal();
		};
		this.dishService.insertDish(dish, closeCallBack);
	}

	public deleteDish() {
		const self = this;
		const closeCallBack = () => {
			self.closeModal();
		};
		this.dishService.deleteDish(this.selectedDish, closeCallBack);
	}

	public closeModal() {
		this.close.emit(true);
	}
}
