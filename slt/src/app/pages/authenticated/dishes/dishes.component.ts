import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../../../model/ingredient';
import { Dish } from '../../../model/dish';
import { DishService } from '../../../services/dish.service';
import { AlertService } from '@app/services/alert.service';

@Component({
	selector: 'app-dishes',
	templateUrl: './dishes.component.html',
	styleUrls: ['./dishes.component.scss']
})
export class DishesComponent implements OnInit {

	public allDishes: Dish[] = [];
	public selectedDish: Dish;
	public modalIsVisible = false;

	constructor(private dishService: DishService,
		private alertService: AlertService) { }

	ngOnInit() {
		this.getAllDishes();
	}

	getAllDishes(): void {
		this.dishService.getAllDishes().subscribe(
			data => {
				this.allDishes = data;
				this.allDishes.sort((a, b) => a.name.localeCompare(b.name));
			},
			error => {
				this.alertService.setAlert('Could not get all dishes: ' + error.error, true);
			}
		);
	}

	openModal(dish: Dish): void {
		this.selectedDish = dish;
		this.modalIsVisible = true;
	}

	closeModal(event: any): void {
		this.modalIsVisible = !event;
		this.getAllDishes();
	}

	public getPortion(ingredient: Ingredient, portionId: number) {
		for (const portion of ingredient.food.portions) {
			if (portion.id === portionId) {
				return portion;
			}
		}
	}

	public getIngredientDescription(ingredient: Ingredient): string {
		if (ingredient.portionId) {
			const usedPortion = this.getPortion(ingredient, ingredient.portionId);
			return ingredient.multiplier + ' ' + usedPortion.description;
		} else {
			return ingredient.multiplier * 100 + ' gram';
		}
	}

	public getTotal(dish: Dish) {
		return dish.macrosCalculated;
	}
}
