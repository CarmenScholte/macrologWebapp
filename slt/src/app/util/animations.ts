import { trigger, transition, style, animate } from '@angular/animations';

export class Animations {

  public enterLeave = {
    trigger: trigger('enterLeaveTrigger', [
      transition(':enter', [
        style({ opacity: 0, marginTop: '15px' }),
        animate('0.3s', style({ opacity: 1, marginTop: '0' })),
      ]),
    ])
  };
}
