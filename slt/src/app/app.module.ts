import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { AppComponent } from './app.component';
import { AboutComponent } from './pages/guest/about/about.component';
import { FoodService } from './services/food.service';
import { DiaryService } from './services/diary.service';

import { UserService } from './services/user.service';
import { LoginComponent } from './pages/guest/login/login.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { DishService } from './services/dish.service';
import { ActivityService } from './services/activity.service';
import { WeightService } from './services/weight.service';
import { AuthGuardService } from './services/auth-guard.service';
import { GuestGuardService } from './services/guest-guard.service';
import { ScrollBehaviourService } from './services/scroll-behaviour.service';
import { HealthcheckService } from './services/healthcheck.service';
import { AdminService } from './services/admin.service';
import { WebhookService } from './services/webhook.service';
import { GoogleService } from './services/google.service';
import { HomeComponent } from './pages/guest/home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticatedModule } from './pages/authenticated/authenticated.module';
import { AlertComponent } from './components/alert/alert.component';
import { AlertService } from './services/alert.service';

@NgModule({
	declarations: [
		AppComponent,
		AboutComponent,
		LoginComponent,
		HomeComponent,
		AlertComponent
	],
	imports: [
		BrowserModule,
		ReactiveFormsModule,
		FormsModule,
		HttpClientModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		AuthenticatedModule,
		MatInputModule,
		MatFormFieldModule,
		MatButtonModule,
		MatIconModule,
		MatRippleModule
	],
	providers: [
		AdminService,
		ActivityService,
		FoodService,
		DiaryService,
		UserService,
		AlertService,
		DishService,
		WeightService,
		AuthGuardService,
		GuestGuardService,
		ScrollBehaviourService,
		HealthcheckService,
		WebhookService,
		GoogleService,
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
	],
	bootstrap: [AppComponent],
	entryComponents: []
})
export class AppModule { }
