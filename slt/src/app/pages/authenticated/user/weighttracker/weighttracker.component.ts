import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { WeightService } from '../../../../services/weight.service';
import { Weight } from '../../../../model/weight';
import * as moment from 'moment';
import { DataPoint } from '@app/components/linegraph/linegraph.component';
import { AlertService } from '@app/services/alert.service';

@Component({
  selector: 'weighttracker',
  templateUrl: './weighttracker.component.html',
  styleUrls: ['./weighttracker.component.scss'],
  host: { '(document: click)': 'documentClick($event)' }
})
export class WeightTrackerComponent {

  public trackedWeights = new Array<Weight>();
  public measurementDate: string;
  public weight: number;
  public remark: string;
  public openWeight;

  public dataset: DataPoint[];
  public hasOffgridValue: boolean;

  private pipe: DatePipe;

  constructor(private weightService: WeightService,
    private alertService: AlertService) {
    this.getAllWeights();
    this.pipe = new DatePipe('en-US');
    this.init();
  }

  private getAllWeights() {
    this.weightService.getAllWeights().subscribe(
      data => {
        this.trackedWeights = data;
        this.trackedWeights.sort((a, b) => {
          const date1 = moment(a.day, 'YYYY-M-D', true);
          const date2 = moment(b.day, 'YYYY-M-D', true);
          return this.compare(date1, date2);
        });
        this.getWeightDataset();
      },
      error => {
        this.alertService.setAlert('Could not get weight history: ' + error.error, true);
      }
    );
  }

  public init() {
    this.measurementDate = moment().format('DD-MM-YYYY');
  }

  private compare(momentA, momentB) {
    if (momentA.isBefore(momentB)) {
      return 1;
    } else if (momentA.isAfter(momentB)) {
      return -1;
    } else {
      return 0;
    }
  }

  private getWeightDataset() {
    const dataset = [];
    let numberOfValues = 14;
    if (window.innerWidth > 480) {
      numberOfValues = 21;
    }
    if (window.innerWidth > 768) {
      numberOfValues = 30;
    }
    for (let i = 0; i < numberOfValues; i++) {
      const day = new Date();
      day.setDate(day.getDate() - i);

      const daynumber = day.getDate();
      const weightValue = this.getWeightValueForDay(day, numberOfValues);
      const datapoint = new DataPoint(daynumber, weightValue);
      dataset.push(datapoint);
    }
    this.dataset = dataset;
    this.dataset.reverse();
    const dayBeforeGraph = new Date();
    dayBeforeGraph.setDate(dayBeforeGraph.getDate() - (numberOfValues - 1));
    this.hasOffgridValue = this.hasOffgridWeight(dayBeforeGraph);
  }

  private getWeightValueForDay(date: Date, numberOfValues: number) {
    for (let i = 0; i < numberOfValues; i++) {
      const weight = this.trackedWeights[i];
      if (weight && weight.day === this.pipe.transform(date, 'yyyy-MM-dd')) {
        return weight.weight;
      }
    }
    return undefined;
  }

  private hasOffgridWeight(day: Date): boolean {
    const firstMeasureDay = new Date(this.trackedWeights[this.trackedWeights.length - 1].day);
    if (firstMeasureDay > day) {
      return false;
    }
    return true;
  }

  public saveNewWeight(formUsed): void {
    const newRequest = new Weight();
    newRequest.weight = this.weight;
    const date = moment(this.measurementDate, 'D-M-YYYY', true);
    newRequest.day = this.pipe.transform(date, 'yyyy-MM-dd');
    newRequest.remark = this.remark;

    const closeCallBack = () => {
      formUsed.reset();
      this.getAllWeights();
      this.init();
    };

    this.weightService.storeWeight(newRequest, closeCallBack);
  }

  public editWeight(weight) {
    if (this.openWeight) {
      if (this.openWeight.id === weight.id) {
        weight.editable = true;
      } else {
        this.openWeight.editable = false;
        this.initOpenWeight(weight);
      }
    } else {
      this.initOpenWeight(weight);
    }
  }

  private initOpenWeight(w) {
    this.openWeight = w;
    const date = moment(this.openWeight.day, 'YYYY-M-D', true);
    this.openWeight.dayString = this.pipe.transform(date, 'dd-MM-yyyy');
    this.openWeight.weightString = this.openWeight.weight;
    w.editable = true;
  }

  private closeCallBack(action: string) {
    this.getAllWeights();
    this.openWeight = null;
    this.alertService.setAlert('Your weight measurement has been ' + action, false);
  }

  public deleteWeight(w) {
    this.weightService.deleteWeight(w, () => this.closeCallBack('deleted!'));
  }

  public saveWeight(w) {
    const date = moment(w.dayString, 'D-M-YYYY', true);

    const newRequest = new Weight();
    newRequest.id = w.id;
    newRequest.weight = w.weightString;
    newRequest.day = this.pipe.transform(date, 'yyyy-MM-dd');
    newRequest.remark = w.remark;

    this.weightService.storeWeight(newRequest, () => this.closeCallBack('updated!'));
  }

  private documentClick(event) {
    if (!event.target.classList.contains('weight__day') &&
      !event.target.classList.contains('weight__weight') &&
      !event.target.classList.contains('weight__remark') &&
      !event.target.classList.contains('editweight__day-input') &&
      !event.target.classList.contains('editweight__weight-input') &&
      !event.target.classList.contains('editweight__remark-input') &&
      !event.target.classList.contains('editweight__day') &&
      !event.target.classList.contains('editweight__weight') &&
      !event.target.classList.contains('editweight__remark') &&
      !event.target.classList.contains('editweight')
    ) {
      if (this.openWeight) {
        this.openWeight.editable = false;
      }
    }
  }
}
