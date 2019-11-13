import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { AlertService, Alert } from '@app/services/alert.service';

@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  animations: [
    trigger('alertAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(10px)' }),
        animate('300ms', style({ transform: 'translateY(0px)' })),
      ]),
      transition(':leave', [
        animate('600ms', style({ opacity: 0 }))
      ])
    ]),
  ]
})
export class AlertComponent implements OnInit {

  public message = '';
  public isError = true;
  public isShown = false;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.alertObservable.subscribe((alert: Alert) => {
      this.message = alert.message;
      this.isError = alert.isError;
      this.isShown = true;
      setTimeout(() => {
        this.isShown = false;
      }, 2000);
    });
  }

}
