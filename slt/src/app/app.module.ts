import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { AboutComponent} from './pages/about/about.component';
import { FoodService } from './services/food.service';
import { ToastService } from './services/toast.service';
import { ToastDirective } from './directives/toast.directive';
import { DateValidator } from './directives/date.directive';
import { ToastComponent } from './components/toast/toast.component';
import { DiaryComponent } from './pages/diary/diary.component';
import { LogMealComponent } from './components/log-meal/log-meal.component';
import { LogActivityComponent } from './components/log-activity/log-activity.component';
import { FoodComponent } from './pages/food/food.component';
import { DiaryService } from './services/diary.service';
import { UserComponent } from './pages/user/user.component';
import { IntakeComponent } from './pages/user/intake/intake.component';
import { PersonalComponent } from './pages/user/personal/personal.component';
import { AccountComponent } from './pages/user/account/account.component';
import { WeightTrackerComponent } from './pages/user/weighttracker/weighttracker.component';
import { ConnectivityComponent } from './pages/user/connectivity/connectivity.component';
import { UserService } from './services/user.service';
import { SliderComponent } from './components/slider/slider.component';
import { GoalProgressbarComponent } from './components/goal-progressbar/goal-progressbar.component';
import { AddFoodModalComponent } from './components/add-food-modal/add-food-modal.component';
import { CalculateIntakeModalComponent } from './components/calculate-intake-modal/calculate-intake-modal.component';
import { DishesComponent } from './pages/dishes/dishes.component';
import { GraphsComponent } from './pages/graphs/analytics.component';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { PagerComponent } from './components/pager/pager.component';
import { MakeDishModalComponent } from './components/make-dish-modal/make-dish-modal.component';
import { AutocompleteFoodComponent } from './components/autocomplete-food/autocomplete-food.component';
import { LoginComponent } from './pages/login/login.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { DishService } from './services/dish.service';
import { ActivityService } from './services/activity.service';
import { WeightService } from './services/weight.service';
import { PiechartComponent } from './components/piechart/piechart.component';
import { StackDonutComponent } from './components/stackdonut/stackdonut.component';
import { OnboardingComponent } from './pages/onboarding/onboarding.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ScrollBehaviourService } from './services/scroll-behaviour.service';
import { HealthcheckService } from './services/healthcheck.service';
import { AdminService } from './services/admin.service';
import { AdminComponent } from './pages/admin/admin.component';
import { LinegraphComponent } from './components/linegraph/linegraph.component';
import { BargraphComponent } from './components/bargraph/bargraph.component';

const appRoutes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'log', component: DiaryComponent, canActivate: [AuthGuardService] },
	{
		path: 'user',
		component: UserComponent,
		canActivate: [AuthGuardService],
		children: [
			{ path: '', redirectTo: 'personal', pathMatch: 'full' },
			{ path: 'personal', component: PersonalComponent },
			{ path: 'foodintake', component: IntakeComponent },
			{ path: 'weighttracker', component: WeightTrackerComponent },
			{ path: 'connectivity', component: ConnectivityComponent },
			{ path: 'account', component: AccountComponent }
		]
	},
	{ path: 'admin', component: AdminComponent, canActivate: [AuthGuardService] },
	{ path: 'onboarding', component: OnboardingComponent, canActivate: [AuthGuardService] },
	{ path: 'food', component: FoodComponent, canActivate: [AuthGuardService] },
	{ path: 'dishes', component: DishesComponent, canActivate: [AuthGuardService] },
	{ path: 'graphs', component: GraphsComponent, canActivate: [AuthGuardService] },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuardService]},
	{ path: '', redirectTo: '/log', pathMatch: 'full', canActivate: [AuthGuardService] },
	{ path: '**', redirectTo: '/log', pathMatch: 'full', canActivate: [AuthGuardService] }
];

@NgModule({
	declarations: [
    AboutComponent,
		AdminComponent,
		AppComponent,
		DiaryComponent,
		LogMealComponent,
		LogActivityComponent,
		FoodComponent,
		UserComponent,
		IntakeComponent,
		PersonalComponent,
		AccountComponent,
		WeightTrackerComponent,
		ConnectivityComponent,
		SliderComponent,
		GoalProgressbarComponent,
		AddFoodModalComponent,
		CalculateIntakeModalComponent,
		DishesComponent,
		GraphsComponent,
		DatepickerComponent,
		ToastComponent,
		ToastDirective,
		DateValidator,
		LoginComponent,
		PagerComponent,
		MakeDishModalComponent,
		AutocompleteFoodComponent,
		PiechartComponent,
    StackDonutComponent,
		OnboardingComponent,
		StepperComponent,
		LinegraphComponent,
		BargraphComponent
	],
	imports: [
		BrowserModule,
		ReactiveFormsModule,
		FormsModule,
		HttpClientModule,
		RouterModule.forRoot(appRoutes),
		BrowserAnimationsModule,
		MatInputModule,
		MatRadioModule,
		MatFormFieldModule,
		MatButtonModule,
		MatIconModule,
		MatTableModule,
		MatRippleModule,
		MatProgressSpinnerModule
	],
	providers: [
		AdminService,
		ActivityService,
		FoodService,
		DiaryService,
		UserService,
		ToastService,
		DishService,
		WeightService,
		AuthGuardService,
		ScrollBehaviourService,
		HealthcheckService,
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
	],
	bootstrap: [AppComponent],
	entryComponents: []
})
export class AppModule { }
