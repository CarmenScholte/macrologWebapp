import { Component, Input, ViewChild, ElementRef, AfterViewInit, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'linegraph',
  templateUrl: './linegraph.component.html',
  styleUrls: ['./linegraph.component.scss']
})
export class LinegraphComponent implements AfterViewInit, OnChanges {

  @ViewChild('yAxis', { static: false }) public yAxisElement: ElementRef;
  @ViewChild('xAxis', { static: false }) public xAxisElement: ElementRef;

  @Input() dataset: DataPoint[];
  @Input() yAxisStep: number;
  @Input() xAxisStep: number;
  @Input() hasOffgridValue: boolean;

  public graphPoints: GraphPoint[];
  public yAxisPoints: number[];
  public xAxisPoints: number[];
  public svgPath: string;
  public trendPath: string;

  yAxisHeight: number;
  private xAxisWidth: number;
  private xAxisPointWidth: number;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataset'] && this.dataset !== undefined) {
      this.yAxisPoints = this.determineYAxisPoints();
      this.xAxisPoints = this.determineXAxisPoints();
      this.graphPoints = this.convertDatasetToPoints();

      this.calculateGraph();
      this.calculateTrend();
    }
  }

  ngAfterViewInit() {
    this.yAxisHeight = this.yAxisElement.nativeElement.clientHeight;
    this.xAxisWidth = this.xAxisElement.nativeElement.clientWidth;
    if (this.dataset !== undefined) {
      this.graphPoints = this.convertDatasetToPoints();
    }
  }

  calculateGraph() {
    this.xAxisPointWidth = this.xAxisWidth / this.dataset.length;
    const yStartPosition = this.determineYStartPosition();
    const xStartPosition = this.determineXStartPosition();

    this.svgPath = 'M' + xStartPosition + ' ' + yStartPosition;

    let xPosition = 0;
    const xStartOffset = this.xAxisPointWidth / 2; // first data point

    if (window.innerWidth > 768 && this.dataset.length > 61) {
      // make line graph
      for (let i = 0; i < this.graphPoints.length; i++) {
        const graphPoint = this.graphPoints[i];
        if (graphPoint.height !== undefined) {
          xPosition = (this.xAxisPointWidth * i) + xStartOffset;
          this.svgPath += ' L' + xPosition + ' ' + (this.yAxisHeight - graphPoint.height);
        }
      }
      this.svgPath += ' L' + xPosition + ' ' + this.yAxisHeight +
        ' L' + xStartPosition + ' ' + this.yAxisHeight + ' Z';
    } else {
      //make curved path
      for (let i = 0; i < this.graphPoints.length; i++) {
        const graphPoint = this.graphPoints[i];
        if (graphPoint.height !== undefined) {
          if (xPosition === 0) {
            xPosition = (this.xAxisPointWidth * i) + xStartOffset;
            this.svgPath += ' L' + xPosition + ' ' + (this.yAxisHeight - graphPoint.height);
          } else {
            xPosition = (this.xAxisPointWidth * i) + xStartOffset;
            const previousXPosition = (this.xAxisPointWidth * i) + xStartOffset - this.xAxisPointWidth;
            const x1 = previousXPosition + 20;
            let previousYPosition: number;
            let j = i - 1;
            while (j >= 0) {
              if (this.graphPoints[j].height !== undefined) {
                previousYPosition = this.yAxisHeight - this.graphPoints[j].height;
                break;
              }
              j--;
            }

            const y1 = previousYPosition;

            const x2 = xPosition - 20;
            const y2 = this.yAxisHeight - graphPoint.height;

            // bezier curve to next data point
            this.svgPath += ' C' + x1 + ' ' + y1 + ' ' + x2 + ' ' + y2 + ' ' + xPosition + ' ' + (this.yAxisHeight - graphPoint.height);
          }
        }
      }
      this.svgPath += ' L' + xPosition + ' ' + this.yAxisHeight +
        ' L' + xStartPosition + ' ' + this.yAxisHeight + ' Z';
    }
  }

  calculateTrend() {
    const valueset = [];
    const convertedDataset = [];
    for (let i = 1; i <= this.dataset.length; i++) {
      const newPoint = new DataPoint(i, this.dataset[i - 1].y);
      newPoint.x = i;
      convertedDataset.push(newPoint);
    }

    for (const point of convertedDataset) {
      if (point.y !== undefined) {
        valueset.push(point);
      }
    }
    let sumOfXTimesY = 0;
    let sumOfXValues = 0;
    let sumOfYValues = 0;
    let sumOfXSquared = 0;
    for (const point of valueset) {
      sumOfXTimesY += (point.x * point.y);
      sumOfXValues += point.x;
      sumOfYValues += point.y;
      sumOfXSquared += (point.x * point.x);
    }

    const a = valueset.length * sumOfXTimesY;
    const b = sumOfXValues * sumOfYValues;
    const c = valueset.length * sumOfXSquared;
    const d = sumOfXValues * sumOfXValues;
    const slope = (a - b) / (c - d);

    const e = sumOfYValues;
    const f = slope * sumOfXValues;
    const intercept = (e - f) / valueset.length;

    // y = slope * x + intercept
    let yStart = intercept;
    let yEnd = slope * (this.dataset.length - 0.5) + intercept;

    const lowest = this.yAxisPoints[this.yAxisPoints.length - 1];
    const difference = this.yAxisPoints[0] - lowest;
    yStart = yStart - lowest;
    yStart = yStart * (this.yAxisHeight / difference);
    yStart = this.yAxisHeight - yStart;

    yEnd = yEnd - lowest;
    yEnd = yEnd * (this.yAxisHeight / difference);
    yEnd = this.yAxisHeight - yEnd;

    this.trendPath = 'M0 ' + yStart + ' L' + (this.xAxisWidth - (this.xAxisPointWidth / 2)) + ' ' + yEnd +
      ' L' + (this.xAxisWidth - (this.xAxisPointWidth / 2)) + ' ' + this.yAxisHeight +
      ' L0 ' + this.yAxisHeight + ' Z';
  }

  private determineXStartPosition(): number {
    if (this.hasOffgridValue) {
      return 0;
    }
    for (let i = 0; i < this.graphPoints.length; i++) {
      const dataPoint = this.graphPoints[i];
      if (dataPoint.height !== undefined) {
        return (this.xAxisPointWidth * i) + this.xAxisPointWidth / 2;
      }
    }
    return 0;
  }

  private determineYStartPosition(): number {
    for (let j = 0; j < this.graphPoints.length; j++) {
      const dataPoint = this.graphPoints[j];
      if (dataPoint.height !== undefined) {
        return this.yAxisHeight - dataPoint.height;
      }
    }
    return 0;
  }

  determineYAxisPoints() {
    const yAxisPoints = [];
    const yValues = [];
    for (let i = 0; i < this.dataset.length; i++) {
      if (this.dataset[i].y !== undefined) {
        yValues.push(this.dataset[i].y);
      }
    }
    yValues.sort();

    const highest = yValues[yValues.length - 1];
    const lowest = yValues[0];
    const difference = highest - lowest;
    const leftover = lowest % this.yAxisStep;

    yAxisPoints.push(lowest - leftover);
    const yValuesToAdd = Math.round(difference / this.yAxisStep) + 1;
    for (let j = 0; j < yValuesToAdd; j++) {
      let value = yAxisPoints[j];
      value += this.yAxisStep;
      yAxisPoints.push(value);
    }
    yAxisPoints.reverse();
    return yAxisPoints;
  }

  determineXAxisPoints() {
    const xAxisPoints = [];
    for (let i = 0; i < this.dataset.length; i++) {
      xAxisPoints.push(this.dataset[i].x);
    }
    return xAxisPoints;
  }

  convertDatasetToPoints() {
    const graphPoints = [];
    for (const dataPoint of this.dataset) {
      const lowestYValue = this.yAxisPoints[this.yAxisPoints.length - 1];
      const differenceHighestLowestYValue = this.yAxisPoints[0] - lowestYValue;
      let height: number;
      if (dataPoint.y !== undefined) {
        height = (dataPoint.y - lowestYValue) * (this.yAxisHeight / differenceHighestLowestYValue);
      }
      const graphPoint = new GraphPoint(dataPoint.y, height);
      graphPoints.push(graphPoint);
    }
    return graphPoints;
  }
}

export class DataPoint {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class GraphPoint {
  public value: number;
  public height: number;

  constructor(value: number, height: number) {
    this.value = value;
    this.height = height;
  }
}
