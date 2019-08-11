import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../../model/ingredient';
import { Dish } from '../../model/dish';
import { StoreDishRequest } from '../../model/storeDishRequest';
import { DishService } from '../../services/dish.service';

@Component({
	selector: 'app-dishes',
	templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.scss']
})
export class DishesComponent implements OnInit {

	public allDishes: Dish[];
  public selectedDish;
	public modalIsVisible = false;

	constructor(private dishService: DishService) { }

	ngOnInit() {
		this.getAllDishes();
	}

	public getAllDishes() {
		this.dishService.getAllDishes().subscribe(
			data => {
				this.allDishes = data;
        this.allDishes.sort((a,b) => a.name.localeCompare(b.name));
			},
			error => console.log(error)
		);
	}

	openModal(dish:Dish) {
    this.selectedDish = dish;
		this.modalIsVisible = true;
	}

	closeModal(event) {
		this.modalIsVisible = !event;
		this.getAllDishes();
	}

  public getPortion(ingredient:Ingredient, portionId: number) {

     for (const portion of ingredient.food.portions) {
       if (portion.id == portionId) {
          return portion;
       }
     }
     console.log("Unknown portion");
  }
  public getIngredientDescription(ingredient: Ingredient) {
     if (ingredient.portionId){
        let usedPortion=  this.getPortion(ingredient, ingredient.portionId);
        return ingredient.multiplier + " " + usedPortion.description;
     } else {
        return ingredient.multiplier * 100  + " gram";
     }
  }

	public getTotal(dish: Dish) {
		return dish.macrosCalculated;
	}
}