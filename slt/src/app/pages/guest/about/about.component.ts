import { Component } from '@angular/core';
import { AuthenticationService } from '@app/services/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
	selector: 'about',
	templateUrl: './about.component.html',
	animations: [
		trigger('enterLeaveTrigger', [
			transition(':enter', [
				style({ transform: 'translateY(15px)' }),
				animate('300ms', style({ transform: 'translateY(0px)' }))
			]),
		])
	],
	styleUrls: ['./about.component.scss']
})
export class AboutComponent {

	public menuToggle = false;

	constructor(private authService: AuthenticationService) {
	}

	public toggleMenu() {
		this.menuToggle = !this.menuToggle;
	}

	public isLoggedIn() {
		return this.authService.isAuthenticated();
	}

}
