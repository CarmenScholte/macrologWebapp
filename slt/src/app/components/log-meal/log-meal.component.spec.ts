import { LogMealComponent } from './log-meal.component';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { DiaryService } from '@app/services/diary.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { LogEntry } from '@app/model/logEntry';
import { Portion } from '@app/model/portion';
import { Food } from '@app/model/food';
import { FoodSearchable } from '@app/model/foodSearchable';
import { StoreLogRequest } from '@app/model/storeLogRequest';
import { AlertService } from '@app/services/alert.service';

describe('LogMealComponent', () => {
    let component: LogMealComponent;
    let fixture: ComponentFixture<LogMealComponent>;
    let diaryService: DiaryService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LogMealComponent],
            providers: [DiaryService, AlertService],
            imports: [HttpClientTestingModule],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LogMealComponent);
        component = fixture.componentInstance;
        diaryService = TestBed.get(DiaryService);
        fixture.detectChanges();
    });

    it('should create log-meal component', () => {
        expect(component).toBeTruthy();
    });

    it('should init log-meal component', () => {
        component.ngOnInit();
        expect(component.addLogEntryCallBack).not.toEqual(undefined);
    });

    it('should handle changes to the date input', () => {
        spyOn(component, 'saveAndClose');
        let changes = { ['date']: undefined };
        component.ngOnChanges(changes);
        expect(component.saveAndClose).not.toHaveBeenCalled();
        changes = { ['date']: new SimpleChange(undefined, '2019-01-01', true) };
        component.editable = true;
        component.ngOnChanges(changes);
        expect(component.saveAndClose).toHaveBeenCalled();
    });

    it('should handle changes to the editable property input', () => {
        spyOn(component, 'saveAndClose');
        let changes = { ['open']: new SimpleChange(undefined, false, true) };
        component.ngOnChanges(changes);
        expect(component.saveAndClose).not.toHaveBeenCalled();
        changes = { ['open']: new SimpleChange(undefined, false, false) };
        component.ngOnChanges(changes);
        expect(component.saveAndClose).toHaveBeenCalled();
        changes = { ['open']: new SimpleChange(true, true, false) };
        component.ngOnChanges(changes);
        expect(component.editable).toBeTruthy();
    });

    it('should close the editable log-meal', () => {
        component.meal = 'lunch';
        component.editable = true;
        fixture.detectChanges();
        const closeButton = fixture.debugElement.query(By.css('#closeBtn'));
        closeButton.nativeElement.click();
        fixture.detectChanges();
        expect(component.editable).toBeFalsy();
    });

    it('should call setmultiplier when input changes', () => {
        spyOn(component, 'setLogEntryMultiplier');
        const logEntry = new LogEntry();
        logEntry.id = 1;
        const food = new Food('name', 1, 2, 3);
        const portion = new Portion();
        portion.description = 'desc';
        const macros = { protein: 1, fat: 2, carbs: 3 };
        logEntry.food = food;
        logEntry.portion = portion;
        logEntry.macrosCalculated = macros;
        component.logEntries = [logEntry];

        spyOn(component, 'getAvailablePortions').and.returnValue([portion]);

        component.meal = 'lunch';
        component.editable = true;
        fixture.detectChanges();
        const inputAmount = fixture.debugElement.query(By.css('#portionAmountInput'));
        inputAmount.nativeElement.value = '2';
        inputAmount.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(component.setLogEntryMultiplier).toHaveBeenCalled();
    });

    it('should set the multiplier on logentry', () => {
        const logEntry = new LogEntry();
        logEntry.multiplier = 5;
        const portion = new Portion();
        portion.description = 'desc';
        logEntry.portion = portion;

        let event = { target: { value: 5. }, data: '.' };
        let result = component.setLogEntryMultiplier(event, logEntry);
        expect(result).toEqual(5);
        event = { target: { value: 5.6 }, data: '6' };
        result = component.setLogEntryMultiplier(event, logEntry);
        expect(result).toEqual(5.6);
        logEntry.portion = undefined;
        event = { target: { value: 150 }, data: '0' };
        result = component.setLogEntryMultiplier(event, logEntry);
        expect(result).toEqual(1.5);
    });

    it('should get amount value from logentry', () => {
        const logEntry = new LogEntry();
        logEntry.multiplier = 5;

        let result = component.getAmountValue(logEntry);
        expect(result).toEqual(500);
        logEntry.portion = new Portion();
        result = component.getAmountValue(logEntry);
        expect(result).toEqual(5);
    });

    it('should call amount change on keyup', () => {
        spyOn(component, 'amountChange');
        const logEntry = new LogEntry();
        logEntry.id = 1;
        const food = new Food('name', 1, 2, 3);
        const portion = new Portion();
        portion.description = 'desc';
        const macros = { protein: 1, fat: 2, carbs: 3 };
        logEntry.food = food;
        logEntry.portion = portion;
        logEntry.macrosCalculated = macros;
        component.logEntries = [logEntry];

        spyOn(component, 'getAvailablePortions').and.returnValue([portion]);

        component.meal = 'lunch';
        component.editable = true;
        fixture.detectChanges();
        const inputAmount = fixture.debugElement.query(By.css('#portionAmountInput'));
        inputAmount.nativeElement.dispatchEvent(new KeyboardEvent('keyup'));
        fixture.detectChanges();
        expect(component.amountChange).toHaveBeenCalled();
    });

    it('should update macros calculated on logentry', () => {
        const logEntry = new LogEntry();
        logEntry.multiplier = 3;
        const food = new Food('name', 1, 2, 3);
        const portion = new Portion();
        portion.description = 'desc';
        portion.macros = { protein: 2, fat: 4, carbs: 6, calories: 8 };
        const macros = { protein: 0, fat: 0, carbs: 0, calories: 0 };
        logEntry.food = food;
        logEntry.portion = portion;
        logEntry.macrosCalculated = macros;

        component.amountChange(logEntry);
        let result = { protein: 6, fat: 12, carbs: 18, calories: 204 };
        expect(logEntry.macrosCalculated).toEqual(result);

        logEntry.portion = undefined;
        component.amountChange(logEntry);
        result = { protein: 3, fat: 6, carbs: 9, calories: 102 };
        expect(logEntry.macrosCalculated).toEqual(result);
    });

    it('should return whether grams is selected', () => {
        const logEntry = new LogEntry();
        let result = component.isGramsSelected(logEntry);
        expect(result).toEqual(true);

        logEntry.id = 1;
        result = component.isGramsSelected(logEntry);
        expect(result).toEqual(true);

        logEntry.portion = new Portion();
        result = component.isGramsSelected(logEntry);
        expect(result).toEqual(false);
    });

    it('should return whether unit is selected', () => {
        const portion = new Portion();
        portion.description = 'desc';
        const logEntry = new LogEntry();
        logEntry.portion = portion;
        let result = component.isUnitSelected(logEntry, portion);
        expect(result).toEqual(true);

        logEntry.portion = undefined;
        result = component.isUnitSelected(logEntry, portion);
        expect(result).toEqual(false);
    });

    it('should get available portions', () => {
        const food = new Food('name', 1, 2, 3);
        food.id = 5;
        const portionOne = new Portion();
        portionOne.description = 'portionOne';
        const portionTwo = new Portion();
        portionTwo.description = 'portionTwo';
        food.portions = [portionOne, portionTwo];
        const searchables = [new FoodSearchable(food)];
        component.searchables = searchables;

        const logEntry = new LogEntry();
        logEntry.food = food;
        let result = component.getAvailablePortions(logEntry);
        expect(result).toEqual([portionOne, portionTwo]);

        const newFood = new Food('name', 1, 2, 3);
        newFood.id = 6;
        logEntry.food = newFood;
        result = component.getAvailablePortions(logEntry);
        expect(result).toEqual(undefined);
    });

    it('should change portion on logentry', () => {
        spyOn(component, 'updateCalculatedMacros');
        let event = { target: { value: 'grams' } };
        const logEntry = new LogEntry();
        const food = new Food('name', 1, 2, 3);
        const portionOne = new Portion();
        portionOne.description = 'portionOne';
        const portionTwo = new Portion();
        portionTwo.description = 'portionTwo';
        food.portions = [portionOne, portionTwo];
        logEntry.food = food;
        const portion = new Portion();
        portion.description = 'stuk';
        logEntry.portion = portion;

        component.portionChange(logEntry, event);
        expect(logEntry.portion).toEqual(undefined);
        expect(component.updateCalculatedMacros).toHaveBeenCalled();

        event = { target: { value: 'portionTwo' } };
        component.portionChange(logEntry, event);
        expect(logEntry.portion).toEqual(portionTwo);
    });

    it('should add new logentry', () => {
        spyOn(component, 'updateCalculatedMacros');
        const searchable = new FoodSearchable(new Food('name', 1, 2, 3));
        component.logEntries = [];
        component.meal = 'lunch';
        const date = new Date();
        component.date = date;

        component.addLogEntry(searchable);
        expect(component.updateCalculatedMacros).toHaveBeenCalled();
        const result = new LogEntry();
        result.meal = 'LUNCH';
        result.day = date;
        result.food = new Food('name', 1, 2, 3);
        expect(component.logEntries).toEqual([result]);
    });

    it('should save and close', () => {
        spyOn(component, 'close');
        spyOn(diaryService, 'storeLogEntries');
        const logEntry = new LogEntry();
        logEntry.id = 1;
        const food = new Food('name', 1, 2, 3);
        food.id = 123;
        logEntry.food = food;
        logEntry.multiplier = 5;
        logEntry.day = new Date(2019, 0, 1);
        component.meal = 'LUNCH';
        component.logEntries = [logEntry];

        const resultReuqest = new StoreLogRequest();
        resultReuqest.id = 1;
        resultReuqest.foodId = 123;
        resultReuqest.multiplier = 5;
        resultReuqest.day = '2019-01-01';
        resultReuqest.meal = 'LUNCH';

        const allEntries = [resultReuqest];
        const callback = () => {
        };
        component.closeCallBack = callback;
        component.saveAndClose();
        expect(component.close).toHaveBeenCalled();
        expect(diaryService.storeLogEntries).toHaveBeenCalledWith(allEntries, callback);
    });

    it('should copy from previous day', () => {

    });


});
