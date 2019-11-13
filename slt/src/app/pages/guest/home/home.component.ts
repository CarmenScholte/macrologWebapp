import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/services/auth.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public showMenu = false;

  constructor(private authService: AuthenticationService) { }

  public toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  public isLoggedIn() {
    return this.authService.isAuthenticated();
  }
}
