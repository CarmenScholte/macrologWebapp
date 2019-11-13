import { Component } from '@angular/core';
import { AuthenticationService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '@app/services/alert.service';

@Component({
	selector: 'account',
	templateUrl: './account.component.html'
})
export class AccountComponent {

	public message = '';
	public oldPassword: string;
	public newPassword: string;
	public confirmPassword: string;
	public modalOpen = false;
	public password: string;
	public errorMessage: string;

	constructor(private authService: AuthenticationService,
		private alertService: AlertService,
		private router: Router) {
	}

	public changePassword() {
		this.message = '';
		if (this.newPassword !== this.confirmPassword) {
			this.message = 'The confirmation password does not match with the new password.';
		} else {
			this.authService.changePassword(this.oldPassword, this.newPassword, this.confirmPassword)
				.subscribe(
					data => {
						if (data.status === 200) {
							this.alertService.setAlert('Your password was changed successfully!', false);
							this.oldPassword = '';
							this.newPassword = '';
							this.confirmPassword = '';
						}
					},
					error => {
						if (error.status === 400 && error.error === 'passwords do not match') {
							this.message = 'The confirmation password does not match with the new password.';
						} else if (error.status === 401) {
							this.message = 'Password invalid';
						} else {
							this.alertService.setAlert('Could not change password: ' + error.error, true);
						}
					});
		}
	}

	public deleteAccount() {
		this.authService.deleteAccount(this.password).subscribe(
			() => {
				localStorage.clear();
				this.router.navigate(['/']);
			},
			error => {
				if (error.status === 401) {
					this.errorMessage = 'Password is incorrect';
				} else {
					this.alertService.setAlert('Could not delete account: ' + error.error, true);
				}
			}
		);
	}

	public openModal() {
		this.modalOpen = true;
	}

	public closeModal() {
		this.modalOpen = false;
	}
}
