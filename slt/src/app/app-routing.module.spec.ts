/* tslint:disable:no-unused-variable */
import { Location } from "@angular/common";
import { TestBed, fakeAsync, tick, ComponentFixture } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";

import { routes } from "./app-routing.module";
import { AboutComponent } from "./pages/guest/about/about.component";
import { AuthenticatedComponent } from "./pages/authenticated/authenticated.component";
import { LoginComponent } from "./pages/guest/login/login.component";
import { HomeComponent } from "./pages/guest/home/home.component";
import { AppComponent } from "./app.component";
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpHandler, HttpClient } from "@angular/common/http";
import { ScrollBehaviourService } from "./services/scroll-behaviour.service";
import { HealthcheckService } from "./services/healthcheck.service";
import { ToastService } from "./services/toast.service";

describe("Router app", () => {
  let location: Location;
  let router: Router;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), FormsModule],
      providers: [HttpClient, HttpHandler, ScrollBehaviourService, HealthcheckService, ToastService],
      declarations: [HomeComponent, AboutComponent, AuthenticatedComponent, LoginComponent, AppComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    });

    router = TestBed.get(Router);
    location = TestBed.get(Location);

    fixture = TestBed.createComponent(AppComponent);
    router.initialNavigation();
  });

  it('should navigate to home', fakeAsync(() => {
    router.navigate([""]).then(() => {
      expect(location.path()).toBe("/");
    });
    tick();
  }));

  it('should navigate to about', fakeAsync(() => {
    router.navigate(["/about"]).then(() => {
      expect(location.path()).toBe("/about");
    });
    tick();
  }));

  it('should navigate to login', fakeAsync(() => {
    router.navigate(["/login"]).then(() => {
      expect(location.path()).toBe("/login");
    });
    tick();
  }));

  it('should navigate to authenticated', fakeAsync(() => {
    router.navigate(["/log"]).then(() => {
    }).catch((error) => {
      expect(location.path()).toBe("/");
    })
    tick();
  }));
});