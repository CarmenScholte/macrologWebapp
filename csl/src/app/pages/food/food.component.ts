import {Component, OnInit}from '@angular/core';
import {FoodService}from '../../services/food.service';
import {Food} from '../../model/food';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html'
})
export class FoodComponent implements OnInit {

	// All food from database, don't overwrite
  private allFoodFromDB = new Array();

	// All food but converted to percentages of macro's
	public percentageFood = new Array();

	// All food after search, sorted
	public searchableFood = new Array();

	// Displayed on one page
	public displayedFood = new Array();

	public modalIsVisible: boolean = false;
	public currentPage = 1;
	public itemsPerPage = 15;
  public selectedFood = null; // input voor modal popup
	public searchInput = '';
	public currentSortHeader = 'name';
	public sortReverse = false;
	public displayMode = 'grams';

  constructor(private foodService: FoodService) { }

	ngOnInit() {
     this.loadAllFood();
  };

	private loadAllFood(){
    this.foodService.getAllFood().subscribe(
      data => {
        this.allFoodFromDB = data;
				this.percentageFood = this.calculatePercentages();
				this.searchableFood = this.allFoodFromDB;
      },
			error => console.log(error)
		);
  }

	public getPagedFood(page: number): void {
		this.currentPage = page;
		this.displayedFood = this.searchableFood.slice(
			(page * this.itemsPerPage) - this.itemsPerPage,
			((page + 1) * this.itemsPerPage) - this.itemsPerPage);
	}

	public findFoodMatch(): void {
		let foodMatch = new Array<Food>();
		for (let food of this.searchableFood) {
      let matchFoodName = food.name.toLowerCase().indexOf(this.searchInput.toLowerCase()) >= 0;
			if (matchFoodName) {
				foodMatch.push(food);
			}
		}

		this.searchableFood = foodMatch;
	}

	public openModal(food) {
    this.selectedFood = food;
		this.modalIsVisible = true;
	}

  public closeModal(event) {
    this.loadAllFood();
		this.modalIsVisible = false;
	}

	public clearSearch(): void {
		this.searchInput = '';
		this.searchableFood = this.allFoodFromDB;
	}

	private setReversed(header: string): void {
		if (this.currentSortHeader === header) {
			this.sortReverse = !this.sortReverse;
		} else {
			this.sortReverse = false;
			this.currentSortHeader = header;
		}
	}

	public sortBy(header: string): void {
		this.setReversed(header);

		let sortedArray = this.searchableFood;
		sortedArray.sort((a: Food, b: Food) => {
			if (a[header] < b[header]) {
				return 1;
			} else if (a[header] > b[header]) {
				return -1;
			} else {
				return 0;
			}
		});

		if(this.sortReverse) {
			sortedArray.reverse();
		}

		this.searchableFood = sortedArray;
		this.getPagedFood(this.currentPage);
	}

	public changeDisplay(mode: string): void {
		this.currentPage = 1;
		this.displayMode = mode;

		if (this.displayMode === 'grams') {
			this.searchableFood = this.allFoodFromDB;
		} else {
			this.searchableFood = this.percentageFood;
		}

		this.searchableFood

		this.findFoodMatch();
		this.getPagedFood(this.currentPage);
	}

	private calculatePercentages() {
		let percentageFood = new Array();

		for (let food of this.allFoodFromDB) {
			let total = food.protein + food.fat + food.carbs;
			let newProtein = food.protein / total * 100;
			let newFat = food.fat / total * 100;
			let newCarbs = food.carbs / total * 100;

			let newFood = { name: food.name,
					protein: newProtein,
					fat: newFat,
					carbs: newCarbs }

			percentageFood.push(newFood);
		}
		return percentageFood;
	}

}
