import { Component, ViewChild } from '@angular/core';
import { ToastService } from '../../../services/toast.service';
import { ToastDirective } from '../../../directives/toast.directive';

@Component({
  selector: 'toast-component',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  @ViewChild(ToastDirective, { static: false }) toast: ToastDirective;

  public message: string;

  constructor(private toastService: ToastService) {
    this.toastService.messageObservable.subscribe((message: string) => {
      this.message = message;
      this.toast.showToast();
    });
  }
}
