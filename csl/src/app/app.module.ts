import {BrowserModule}from'@angular/platform-browser';
import {NgModule}from '@angular/core';
import {FormsModule}from '@angular/forms';
import {ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS}from '@angular/common/http';
import {RouterModule, Routes}from '@angular/router';

import {BrowserAnimationsModule}from '@angular/platform-browser/animations';

import {AppComponent}from './app.component';
import {FoodService}from './services/food.service';
import {ToastService}from './services/toast.service';
import {ToastDirective}from './directives/toast.directive';
import {ToastComponent}from './components/toast/toast.component';
import {LogComponent}from './pages/log/log.component';
import {LogMealComponent} from './components/log-meal/log-meal.component';
import {FoodComponent}from './pages/food/food.component';
import {LogService}from './services/log.service';
import {UserComponent}from './pages/user/user.component';
import {UserService} from './services/user.service';
import {SliderComponent} from './components/slider/slider.component';
import {BargraphComponent} from './components/bargraph/bargraph.component';
import {AddFoodModalComponent} from './components/add-food-modal/add-food-modal.component';
import {CalculateIntakeModalComponent} from './components/calculate-intake-modal/calculate-intake-modal.component';
import {MealsComponent} from './pages/meals/meals.component';
import {GraphsComponent} from './pages/graphs/graphs.component';
import {DatepickerComponent} from './components/datepicker/datepicker.component';
import {Pager} from './components/pager/pager';
import {MakeMealModal} from './components/make-meal-modal/make-meal-modal';
import {AutocompleteFood} from './components/autocomplete-food/autocomplete-food';
import {LoginComponent} from './pages/login/login.component';
import {JwtInterceptor } from './interceptors/jwt.interceptor';
import {ErrorInterceptor } from './interceptors/error.interceptor';
import {MealService} from './services/meal.service';
import {Piechart} from './components/piechart/piechart';
import { IntakeComponent } from './pages/intake/intake.component';
import { StepperComponent } from './components/stepper/stepper.component';

const appRoutes: Routes = [
{path: 'log', component: LogComponent},
{path: 'intake', component: IntakeComponent},
{path: 'food', component: FoodComponent},
{path: 'user', component: UserComponent},
{path: 'meals', component: MealsComponent},
//{path: 'graphs', component: GraphsComponent},
{path: '', redirectTo: '/log', pathMatch: 'full'},
{path: 'login', component: LoginComponent },
{path: 'logout', component: LoginComponent },
{path: '**', redirectTo: '/log', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    LogComponent,
    LogMealComponent,
    FoodComponent,
    UserComponent,
    SliderComponent,
    BargraphComponent,
    AddFoodModalComponent,
		CalculateIntakeModalComponent,
		MealsComponent,
    GraphsComponent,
		DatepickerComponent,
		ToastComponent,
		ToastDirective,
    LoginComponent,
		Pager,
		MakeMealModal,
		AutocompleteFood,
		Piechart,
		IntakeComponent,
		StepperComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
		HttpClientModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule
  ],
  providers: [FoodService,
              LogService,
              UserService,
              ToastService,
							MealService,
              { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
              { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
              ],
  bootstrap: [AppComponent],
  entryComponents: [
  ]
})
export class AppModule { }
