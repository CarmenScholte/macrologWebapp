import { Component, OnInit } from '@angular/core';
import { GoogleService } from '@app/services/google.service';
import { GoogleStatus } from '@app/model/googleStatus';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
})
export class MailComponent implements OnInit {

  constructor(private googleService: GoogleService,
    private route: ActivatedRoute) { }

  private clientId: number;
  public googleConnectUrl: string;
  public isConnected = false;
  public syncError: string;
  public emailAddress: string;
  public mailSend = false;

  private code: string;
  private scope: string;


  ngOnInit() {
    this.retrieveStatus();
  }


  getStatus() {
    return true;
  }

  private retrieveStatus() {
    console.log('getting status');
    this.googleService.getStatus().subscribe(
      res => {
        if (res.connected == "true") {
          this.isConnected = true;
        }
        this.clientId = res.syncedApplicationId;
        this.setGoogleUrl();
        if (!this.isConnected) {
          this.checkRegistrationResponse();
        }
      },
      err => {
        // TODO handle error
      }
    )
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
    console.log('Store the code' + this.code)
    this.googleService.storeMailSyncSettings(this.code).subscribe(result => {
      console.log(result);
      this.isConnected = true;
    });
  }
  private setGoogleUrl() {
    const googleUrl = 'https://accounts.google.com/o/oauth2/auth?response_type=code&approval_prompt=force&scope=https://www.googleapis.com/auth/gmail.send&state=GMAILCONNECT&access_type=offline'
    const redirectUrl = environment.origin + '/admin/mail';
    this.googleConnectUrl = googleUrl + '&client_id=' + this.clientId + '&redirect_uri=' + redirectUrl;
  }

  private sendTestMail() {
    this.mailSend = false;
    this.googleService.sendTestMail(this.emailAddress).subscribe(result => {
      this.mailSend = true;
      this.emailAddress = null;
    });
  }
}