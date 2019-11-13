import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Renderer2, Type } from '@angular/core';
import { ScrollBehaviourService } from '@app/services/scroll-behaviour.service';
import { FoodService } from '@app/services/food.service';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MakeDishModalComponent } from './make-dish-modal.component';
import { DishService } from '@app/services/dish.service';
import { AlertService } from '@app/services/alert.service';

describe('MakeDishModalComponent', () => {
	let component: MakeDishModalComponent;
	let fixture: ComponentFixture<MakeDishModalComponent>;
	let foodService: FoodService;
	let scrollBehaviourService: ScrollBehaviourService;
	let renderer2: Renderer2;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MakeDishModalComponent],
			providers: [ScrollBehaviourService, DishService, FoodService, HttpClient, HttpHandler, AlertService, Renderer2],
			imports: [FormsModule],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MakeDishModalComponent);
		component = fixture.componentInstance;
		foodService = TestBed.get(FoodService);
		scrollBehaviourService = TestBed.get(ScrollBehaviourService);
		renderer2 = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
		scrollBehaviourService.setRenderer(renderer2);
		fixture.detectChanges();
	});

	// it('should create add food modal', () => {
	// 	spyOn(scrollBehaviourService, 'preventScrolling');
	// 	expect(component).toBeTruthy();
	// });
});
