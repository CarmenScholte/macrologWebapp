import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpHandler, HttpClient } from '@angular/common/http';
import { HealthcheckService } from './services/healthcheck.service';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Renderer2, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let healthcheckService: HealthcheckService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'user', redirectTo: '' }]), BrowserAnimationsModule],
      declarations: [AppComponent],
      providers: [HealthcheckService, HttpClient, HttpHandler, Renderer2],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    healthcheckService = TestBed.get(HealthcheckService);
    router = TestBed.get(Router);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should init the app component', fakeAsync(() => {
    spyOn(healthcheckService, 'checkState').and.returnValue(of(true));
    component.ngOnInit();
    tick();
    expect(component.isAsleep()).toEqual(false);
  }));

  it('should do healthcheck unauthorized', fakeAsync(() => {
    spyOn(healthcheckService, 'checkState').and.returnValue(throwError({ status: 403 }));
    component.ngOnInit();
    tick();
    expect(component.isAsleep()).toEqual(false);
  }));

  it('should do healthcheck random error', fakeAsync(() => {
    spyOn(healthcheckService, 'checkState').and.returnValue(throwError({ status: 500 }));
    component.ngOnInit();
    tick();
    expect(component.isAsleep()).toEqual(true);
  }));
});
