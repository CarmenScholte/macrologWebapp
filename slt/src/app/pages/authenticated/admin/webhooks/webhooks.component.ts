import { Component, OnInit } from '@angular/core';
import { WebhookService } from '@app/services/webhook.service';
import { WebhookStatus } from '@app/model/webhookStatus';
import { AlertService } from '@app/services/alert.service';

@Component({
  selector: 'app-webhooks',
  templateUrl: './webhooks.component.html',
  styleUrls: ['./webhooks.component.scss']
})
export class WebhooksComponent implements OnInit {

  constructor(private webhookService: WebhookService,
    private alertService: AlertService) { }

  public allWebhooks = new Array();

  ngOnInit() {
    this.retrieveStatus('STRAVA');
  }

  disableWebhook(connectedApp: string) {
    const hook = this.getStatus(connectedApp);
    this.webhookService.endWebhook(connectedApp, hook.id).subscribe(
      () => {
        this.retrieveStatus(connectedApp);
      },
      error => {
        this.alertService.setAlert('Could not end webhook: ' + error.error, true);
      }
    );
  }

  enableWebhook(connectedApp: string) {
    this.webhookService.startWebhook(connectedApp).subscribe(
      () => {
        this.retrieveStatus(connectedApp);
      },
      error => {
        this.alertService.setAlert('Could not enable webhook: ' + error.error, true);
      }
    );
  }

  getStatus(connectedApp: string): WebhookStatus {
    for (const hook of this.allWebhooks) {
      if (hook.connectedApp === connectedApp) {
        return hook.webhook;
      }
    }
    return undefined;
  }

  private retrieveStatus(connectedApp: string) {
    // delete old one. Only strava now, so delete all :p
    this.allWebhooks = new Array();
    this.webhookService.getWebhookStatus(connectedApp).subscribe(
      res => {
        this.allWebhooks.push({ 'connectedApp': connectedApp, 'webhook': res });
      },
      error => {
        this.alertService.setAlert('Could not get webhook status: ' + error.error, true);
      }
    );
  }
}
