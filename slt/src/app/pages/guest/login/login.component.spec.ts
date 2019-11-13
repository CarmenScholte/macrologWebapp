import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { AuthenticationService } from '@app/services/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AlertService } from '@app/services/alert.service';

describe('LoginComponent', () => {
	let component: LoginComponent;
	let fixture: ComponentFixture<LoginComponent>;
	let authService: AuthenticationService;
	let alertService: AlertService;
	let router: Router;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [LoginComponent],
			providers: [AuthenticationService, AlertService, HttpClient, HttpHandler],
			imports: [FormsModule, BrowserAnimationsModule, RouterTestingModule.withRoutes([])],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance;
		authService = TestBed.get(AuthenticationService);
		alertService = TestBed.get(AlertService);
		router = TestBed.get(Router);
		fixture.detectChanges();
	});

	it('should create component', () => {
		expect(component).toBeTruthy();
	});

	it('should log in', fakeAsync(() => {
		const loginSpy = spyOn(authService, 'login').and.returnValue(of(undefined));
		spyOn(router, 'navigate');
		component.usernameOrEmail = 'username';
		component.password = 'password';

		const loginButton = fixture.debugElement.query(By.css('#loginBtn'));
		loginButton.nativeElement.click();
		tick();
		fixture.detectChanges();

		expect(authService.login).toHaveBeenCalledWith('username', 'password');
		expect(router.navigate).toHaveBeenCalledWith(['/log']);
		expect(component.loginError).toEqual('');

		loginSpy.and.returnValue(throwError({ status: 404 }));
		loginButton.nativeElement.click();
		tick();
		fixture.detectChanges();

		expect(authService.login).toHaveBeenCalledWith('username', 'password');
		expect(component.loginError).toEqual('Username or password incorrect');
	}));

	it('should register new user', fakeAsync(() => {
		const registerSpy = spyOn(authService, 'register').and.returnValue(of({}));
		const loginSpy = spyOn(authService, 'login').and.returnValue(of(undefined));
		spyOn(router, 'navigate');
		component.newUsername = 'username';
		component.newEmail = 'email@email.com';
		component.newPassword = 'password';

		// register and login
		const registerButton = fixture.debugElement.query(By.css('#registerBtn'));
		registerButton.nativeElement.click();
		tick();
		fixture.detectChanges();
		expect(authService.register).toHaveBeenCalledWith('username', 'email@email.com', 'password');
		tick();
		fixture.detectChanges();
		expect(authService.login).toHaveBeenCalledWith('username', 'password');
		expect(component.newUsername).toEqual('');
		expect(component.newEmail).toEqual('');
		expect(component.newPassword).toEqual('');
		tick();
		fixture.detectChanges();
		expect(router.navigate).toHaveBeenCalledWith(['/onboarding']);

		// register but failed login
		registerSpy.and.returnValue(of({}));
		loginSpy.and.returnValue(throwError({ status: 404 }));
		component.newUsername = 'username';
		component.newEmail = 'email@email.com';
		component.newPassword = 'password';

		registerButton.nativeElement.click();
		tick();
		fixture.detectChanges();
		expect(authService.register).toHaveBeenCalledWith('username', 'email@email.com', 'password');
		tick();
		fixture.detectChanges();
		expect(authService.login).toHaveBeenCalledWith('username', 'password');
		tick();
		fixture.detectChanges();
		expect(component.registerError).toEqual('Error on login after registration.');

		// username in use
		component.newUsername = 'username';
		component.newEmail = 'email@email.com';
		component.newPassword = 'password';
		registerSpy.and.returnValue(throwError({ status: 401, error: 'Username or email already in use' }));
		registerButton.nativeElement.click();
		tick();
		fixture.detectChanges();
		expect(component.registerError).toEqual('Username or email is already in use. Please try a different username or use \'Forgot password\' to retrieve a new password.');


		// other error 401
		registerSpy.and.returnValue(throwError({ status: 401, error: 'Error' }));
		registerButton.nativeElement.click();
		tick();
		fixture.detectChanges();
		expect(component.registerError).toEqual('Unknown error during registration.');

		// other error
		registerSpy.and.returnValue(throwError({ status: 404 }));
		registerButton.nativeElement.click();
		tick();
		fixture.detectChanges();
		expect(component.registerError).toEqual('Unknown error during registration.');
	}));

	it('should toggle forgot password modal', () => {
		const forgotLink = fixture.debugElement.query(By.css('#forgotLink'));
		expect(component.showForgotPwModal).toBeFalsy();
		forgotLink.nativeElement.click();
		fixture.detectChanges();
		expect(component.showForgotPwModal).toBeTruthy();

		const forgotModalButton = fixture.debugElement.query(By.css('#forgotClose'));
		forgotModalButton.nativeElement.click();
		fixture.detectChanges();
		expect(component.showForgotPwModal).toBeFalsy();
	});

	it('should reset password', fakeAsync(() => {
		const resetSpy = spyOn(authService, 'resetPassword').and.returnValue(of({}));
		spyOn(alertService, 'setAlert');
		component.forgotError = 'error';
		component.forgotEmail = 'email@email.com';

		const forgotLink = fixture.debugElement.query(By.css('#forgotLink'));
		forgotLink.nativeElement.click();
		fixture.detectChanges();

		let resetBtn = fixture.debugElement.query(By.css('#resetBtn'));
		resetBtn.nativeElement.click();
		expect(resetSpy).toHaveBeenCalledWith('email@email.com');
		expect(component.forgotError).toEqual('');
		tick();
		fixture.detectChanges();
		expect(alertService.setAlert).toHaveBeenCalled();
		expect(component.showForgotPwModal).toBeFalsy();

		resetSpy.and.returnValue(throwError({ status: 404 }));
		forgotLink.nativeElement.click();
		fixture.detectChanges();
		resetBtn = fixture.debugElement.query(By.css('#resetBtn'));
		// the button was gone when the model was closed
		resetBtn.nativeElement.click();
		tick();
		fixture.detectChanges();
		expect(component.forgotError).toEqual('The email adress was not found');

	}));
});
