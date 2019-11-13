import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AlertService } from '@app/services/alert.service';

@Component({
   selector: 'connectivity',
   templateUrl: './connectivity.component.html',
   styleUrls: ['./connectivity.component.scss']
})
export class ConnectivityComponent implements OnInit {

   public syncError: string;
   public stravaConnectUrl: string;

   private code: string;
   private scope: string;
   private connection: any;
   private clientId: number;

   constructor(
      private userService: UserService,
      private alertService: AlertService,
      private route: ActivatedRoute) {
   }

   ngOnInit() {
      this.getSyncSettings();
   }

   public isConnected() {
      return this.connection && this.connection.syncedAccountId;
   }

   public disconnect() {
      this.userService.disconnectSyncSettings('STRAVA').subscribe(() => {
         this.getSyncSettings();
      });
   }

   private getSyncSettings() {
      this.userService.getSyncSettings('STRAVA').subscribe(
         result => {
            this.syncError = '';
            this.connection = result;
            this.clientId = result.syncedApplicationId;
            this.setStravaUrl();
            if (!this.isConnected()) {
               this.checkRegistrationResponse();
            }
         },
         error => {
            this.alertService.setAlert('Could not get all log entries: ' + error.error, true);
         }
      );
   }

   private checkRegistrationResponse() {
      if (!this.code) { // only if not done before
         this.route.queryParamMap.subscribe(queryParams => {
            this.code = queryParams.get('code');
            this.scope = queryParams.get('scope');
            if (this.code) {
               if (this.scope !== 'read,activity:read_all') {
                  this.syncError = 'Please give access to view your activitities in order to allow Macrolog to read your Strava activities';
               } else {
                  this.storeConnection();
               }
            }
         });
      }
   }

   private storeConnection() {
      this.userService.storeSyncSettings('STRAVA', this.code).subscribe(
         result => {
            this.connection = result;
         },
         error => {
            this.alertService.setAlert('Could not store sync settings for strava: ' + error.error, true);
         }
      );
   }

   private setStravaUrl() {
      const stravaUrl = 'http://www.strava.com/oauth/authorize?approval_prompt=force&scope=activity:read_all&response_type=code&state=STRAVACONNECT';
      const redirectUrl = environment.origin + '/user/connectivity';
      this.stravaConnectUrl = stravaUrl + '&client_id=' + this.clientId + '&redirect_uri=' + redirectUrl;
   }
}
