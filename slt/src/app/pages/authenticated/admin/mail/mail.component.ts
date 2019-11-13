import { Component, OnInit } from '@angular/core';
import { GoogleService } from '@app/services/google.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AlertService } from '@app/services/alert.service';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
})
export class MailComponent implements OnInit {

  public googleConnectUrl: string;
  public isConnected = false;
  public syncError: string;
  public emailAddress: string;
  public mailSend = false;

  private clientId: string;
  private code: string;
  private scope: string;

  constructor(private googleService: GoogleService,
    private alertService: AlertService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.retrieveStatus();
  }

  getStatus() {
    return true;
  }

  private retrieveStatus() {
    this.googleService.getStatus().subscribe(
      res => {
        if (res.connected === true) {
          this.isConnected = true;
        }
        this.clientId = res.syncedApplicationId;
        this.setGoogleUrl();
        if (!this.isConnected) {
          this.checkRegistrationResponse();
        }
      },
      err => {
        this.alertService.setAlert(err.error, true);
      }
    );
  }

  private checkRegistrationResponse() {
    if (!this.code) { // only if not done before
      this.route.queryParamMap.subscribe(queryParams => {
        this.code = queryParams.get('code');
        this.scope = queryParams.get('scope');
        if (this.code) {
          if (this.scope !== 'https://www.googleapis.com/auth/gmail.send') {
            this.syncError = 'Please give access to send mail in order to allow Macrolog send mails to new users.';
          } else {
            this.storeConnection();
          }
        }
      });
    }
  }

  private storeConnection() {
    this.googleService.storeMailSyncSettings(this.code).subscribe(
      () => {
        this.isConnected = true;
      },
      err => {
        this.alertService.setAlert(err.error, true);
      });
  }
  private setGoogleUrl() {
    const googleUrl = 'https://accounts.google.com/o/oauth2/auth?response_type=code&approval_prompt=force&scope=https://www.googleapis.com/auth/gmail.send&state=GMAILCONNECT&access_type=offline';
    const redirectUrl = environment.origin + '/admin/mail';
    this.googleConnectUrl = googleUrl + '&client_id=' + this.clientId + '&redirect_uri=' + redirectUrl;
  }

  public sendTestMail() {
    this.mailSend = false;
    this.googleService.sendTestMail(this.emailAddress).subscribe(
      () => {
        this.alertService.setAlert('Email has been sent!', false);
        this.emailAddress = '';
      },
      err => {
        this.alertService.setAlert(err.error, true);
      });
  }
}
