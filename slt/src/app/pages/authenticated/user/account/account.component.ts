import { Component } from '@angular/core';
import { AuthenticationService } from '../../../../services/auth.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
	selector: 'account',
	templateUrl: './account.component.html'
})
export class AccountComponent {

	public message = '';
	public oldPassword: string;
	public newPassword: string;
	public confirmPassword: string;

	constructor(private authService: AuthenticationService,
		private toastService: ToastService) {
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
							this.toastService.setMessage('Your password has changed');
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
						}
					});
		}
	}
}
