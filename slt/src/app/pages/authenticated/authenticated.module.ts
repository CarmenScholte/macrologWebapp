import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticatedRoutingModule } from './authenticated-routing.module';
import { AdminComponent } from './admin/admin.component';
import { DiaryComponent } from './diary/diary.component';
import { LogMealComponent } from '@app/components/log-meal/log-meal.component';
import { LogActivityComponent } from '@app/components/log-activity/log-activity.component';
import { FoodComponent } from './food/food.component';
import { UserComponent } from './user/user.component';
import { UserManagementComponent } from './admin/usermanagement/usermanagement.component';
import { WebhooksComponent } from './admin/webhooks/webhooks.component';
import { MailComponent } from './admin/mail/mail.component';
import { IntakeComponent } from './user/intake/intake.component';
import { PersonalComponent } from './user/personal/personal.component';
import { AccountComponent } from './user/account/account.component';
import { WeightTrackerComponent } from './user/weighttracker/weighttracker.component';
import { ConnectivityComponent } from './user/connectivity/connectivity.component';
import { SliderComponent } from '@app/components/slider/slider.component';
import { AddFoodModalComponent } from '@app/components/add-food-modal/add-food-modal.component';
import { CalculateIntakeModalComponent } from '@app/components/calculate-intake-modal/calculate-intake-modal.component';
import { DishesComponent } from './dishes/dishes.component';
import { GraphsComponent } from './analytics/analytics.component';
import { DatepickerComponent } from '@app/components/datepicker/datepicker.component';
import { DateValidator } from '@app/directives/date.directive';
import { MakeDishModalComponent } from '@app/components/make-dish-modal/make-dish-modal.component';
import { AutocompleteFoodComponent } from '@app/components/autocomplete-food/autocomplete-food.component';
import { PiechartComponent } from '@app/components/piechart/piechart.component';
import { StackDonutComponent } from '@app/components/stackdonut/stackdonut.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { StepperComponent } from '@app/components/stepper/stepper.component';
import { LinegraphComponent } from '@app/components/linegraph/linegraph.component';
import { BargraphComponent } from '@app/components/bargraph/bargraph.component';
import { AuthenticatedComponent } from './authenticated.component';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    AuthenticatedRoutingModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatTableModule
  ],
  declarations: [
    AuthenticatedComponent,
    AdminComponent,
    DiaryComponent,
    LogMealComponent,
    LogActivityComponent,
    FoodComponent,
    UserComponent,
    UserManagementComponent,
    WebhooksComponent,
    MailComponent,
    IntakeComponent,
    PersonalComponent,
    AccountComponent,
    WeightTrackerComponent,
    ConnectivityComponent,
    SliderComponent,
    AddFoodModalComponent,
    CalculateIntakeModalComponent,
    DishesComponent,
    GraphsComponent,
    DatepickerComponent,
    DateValidator,
    MakeDishModalComponent,
    AutocompleteFoodComponent,
    PiechartComponent,
    StackDonutComponent,
    OnboardingComponent,
    StepperComponent,
    LinegraphComponent,
    BargraphComponent,
  ]
})
export class AuthenticatedModule {

}
