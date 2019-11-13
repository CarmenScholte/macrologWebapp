import { AddFoodModalComponent } from './add-food-modal.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Renderer2, Type } from '@angular/core';
import { Food } from '@app/model/food';
import { ScrollBehaviourService } from '@app/services/scroll-behaviour.service';
import { FoodService } from '@app/services/food.service';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Portion } from '@app/model/portion';
import { Macros } from '@app/model/macro';
import { AlertService } from '@app/services/alert.service';

describe('AddFoodModal', () => {
	let component: AddFoodModalComponent;
	let fixture: ComponentFixture<AddFoodModalComponent>;
	let foodService: FoodService;
	let scrollBehaviourService: ScrollBehaviourService;
	let renderer2: Renderer2;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AddFoodModalComponent],
			providers: [ScrollBehaviourService, FoodService, HttpClient, HttpHandler, AlertService, Renderer2],
			imports: [FormsModule],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AddFoodModalComponent);
		component = fixture.componentInstance;
		foodService = TestBed.get(FoodService);
		scrollBehaviourService = TestBed.get(ScrollBehaviourService);
		renderer2 = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
		scrollBehaviourService.setRenderer(renderer2);
		fixture.detectChanges();
	});

	it('should create add food modal', () => {
		spyOn(scrollBehaviourService, 'preventScrolling');
		expect(component).toBeTruthy();
	});

	it('should init add food modal correctly', () => {
		spyOn(scrollBehaviourService, 'preventScrolling');
		component.ngOnInit();
		expect(scrollBehaviourService.preventScrolling).toHaveBeenCalled();
		expect(component.title).toEqual('Add food');

		component.food = new Food('food', 1, 2, 3);
		component.ngOnInit();
		expect(component.title).toEqual('Edit food');
		expect(component.name).toEqual('food');
		expect(component.portions).toEqual([]);

		component.food = new Food('second', 4, 5, 6);
		const portion = new Portion(111, 'piece', new Macros());
		component.food.portions = [portion];
		component.ngOnInit();
		expect(component.portions).toEqual([Object({ grams: 111, description: 'piece', macros: Object({}) })]);
	});

	it('should save food', () => {
		spyOn(scrollBehaviourService, 'preventScrolling');
		spyOn(foodService, 'addFood');

		component.name = 'food';
		component.protein = 1;
		component.fat = 2;
		component.carbs = 3;

		const food = new Food('food', 1, 2, 3);
		food.portions = [];
		component.saveFood();
		expect(foodService.addFood).toHaveBeenCalledWith(food, jasmine.any(Function));
	});

	it('should save edited existing food', () => {
		spyOn(scrollBehaviourService, 'preventScrolling');
		spyOn(foodService, 'addFood');

		component.food = new Food('food', 0, 0, 0);
		component.food.id = 1234;
		component.name = 'food';
		component.protein = 1;
		component.fat = 2;
		component.carbs = 3;

		const food = new Food('food', 1, 2, 3);
		food.id = 1234;
		food.portions = [];
		component.saveFood();
		expect(foodService.addFood).toHaveBeenCalledWith(food, jasmine.any(Function));
	});

	it('should close the modal', () => {
		spyOn(scrollBehaviourService, 'preventScrolling');
		spyOn(component.close, 'emit');
		component.closeModal();
		expect(scrollBehaviourService.preventScrolling).toHaveBeenCalledWith(false);
		expect(component.close.emit).toHaveBeenCalled();
	});

	it('should check if portion is new', () => {
		spyOn(scrollBehaviourService, 'preventScrolling');
		const portion = new Portion(111, 'piece');
		portion.id = undefined;
		let result = component.isNewPortion(portion);
		expect(result).toBeTruthy();

		portion.id = null;
		result = component.isNewPortion(portion);
		expect(result).toBeTruthy();

		portion.id = 0;
		result = component.isNewPortion(portion);
		expect(result).toBeTruthy();

		portion.id = 42;
		result = component.isNewPortion(portion);
		expect(result).toBeFalsy();
	});

	it('should add a new portion to the list', () => {
		spyOn(scrollBehaviourService, 'preventScrolling');
		component.addNewPortion();
		expect(component.portions.length).toEqual(1);
		component.addNewPortion();
		expect(component.portions.length).toEqual(2);
	});

	it('should remove portion from list', () => {
		spyOn(scrollBehaviourService, 'preventScrolling');
		component.portions = [new Portion(111, 'piece'), new Portion(222, 'slice')];
		component.removePortion(1);
		expect(component.portions).toEqual([new Portion(111, 'piece')]);
	});

	it('should close modal on callback', () => {
		spyOn(component, 'closeModal');
		const callback = component.getCloseCallback();
		callback();
		expect(component.closeModal).toHaveBeenCalled();
	});
});
