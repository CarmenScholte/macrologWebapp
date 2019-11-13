import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CalculateIntakeModalComponent } from './calculate-intake-modal.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '@app/services/user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { AlertService } from '@app/services/alert.service';

describe('CalculateIntakeModalComponent', () => {
  let component: CalculateIntakeModalComponent;
  let fixture: ComponentFixture<CalculateIntakeModalComponent>;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalculateIntakeModalComponent],
      providers: [UserService, AlertService],
      imports: [FormsModule, HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculateIntakeModalComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    fixture.detectChanges();
  });

  it('should create calculate-intake-modal', () => {
    expect(component).toBeTruthy();
  });

  it('should init calculate intake modal', () => {
    component.currentProtein = 12;
    component.currentFat = 34;
    component.currentCarbs = 45;
    component.ngOnInit();
    expect(component.calories).toEqual((12 * 4) + (34 * 9) + (45 * 4));
  });

  it('should show calorie tab', () => {
    component.showCalories = false;
    component.showCaloriesTab();
    expect(component.showCalories).toBeTruthy();
  });

  it('should show macros tab', () => {
    component.showCalories = false;
    component.showMacros = false;
    component.showMacrosTab();
    expect(component.showMacros).toBeTruthy();
  });

  it('should close modal', () => {
    spyOn(component.close, 'emit');
    component.closeModal();
    const emitted = {
      goalProtein: undefined, goalFat: undefined, goalCarbs: undefined
    };
    expect(component.close.emit).toHaveBeenCalledWith(emitted);
  });

  it('should change calories', () => {
    component.protein = 100;
    component.fat = 60;
    component.changeCalories(1800);
    expect(component.calories).toEqual(1800);
    expect(component.carbs).toEqual(215);
  });

  it('should calculate calories manually', () => {
    component.proteinManual = 100;
    component.fatManual = 60;
    component.carbsManual = 250;
    component.calcCaloriesManual();
    expect(component.calories).toEqual((100 * 4) + (60 * 9) + (250 * 4));
  });

  it('should save macros intake', fakeAsync(() => {
    const userSpy = spyOn(userService, 'addUserSetting').and.returnValue(throwError({ status: 404 }));
    spyOn(component.close, 'emit');
    component.showMacros = true;
    component.proteinManual = 100;
    component.fatManual = 60;
    component.carbsManual = 250;

    component.saveIntake();
    tick();
    expect(component.close.emit).not.toHaveBeenCalled();

    userSpy.and.returnValue(of({ status: 200 }));
    component.saveIntake();
    tick();
    expect(userService.addUserSetting).toHaveBeenCalledTimes(6);
    const emitted = {
      goalProtein: '100', goalFat: '60', goalCarbs: '250'
    };
    expect(component.close.emit).toHaveBeenCalledWith(emitted);
  }));

  it('should save calories intake', fakeAsync(() => {
    const userSpy = spyOn(userService, 'addUserSetting').and.returnValue(throwError({ status: 404 }));
    spyOn(component.close, 'emit');
    component.showCalories = true;
    component.protein = 100;
    component.fat = 60;
    component.carbs = 250;

    component.saveIntake();
    tick();
    expect(component.close.emit).not.toHaveBeenCalled();

    userSpy.and.returnValue(of({ status: 200 }));
    component.saveIntake();
    tick();
    expect(userService.addUserSetting).toHaveBeenCalledTimes(6);
    const emitted = {
      goalProtein: '100', goalFat: '60', goalCarbs: '250'
    };
    expect(component.close.emit).toHaveBeenCalledWith(emitted);
  }));

});
