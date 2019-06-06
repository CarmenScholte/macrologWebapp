import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { AfterContentInit } from '@angular/core';
import {LogService} from '../../services/log.service';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import * as d3 from 'd3';
import { LogEntry } from '../../model/logEntry';
import * as moment from 'moment';
import { filter } from 'rxjs/operators';

@Component({
	selector: 'app-graphs',
	templateUrl: './graphs.component.html'
})
export class GraphsComponent implements AfterContentInit  {

 radius = 10;
 barWidth=20;

 graphWidth=650;
 graphHeight=400;
 graphLegenda=20;

 public allLogs = new Array();
 public infoMacro = null;

 logBars = new Array();

 public dateFrom = moment().subtract(1, 'months').startOf('month');
 public dateTo = moment().subtract(1, 'months').endOf('month');

  ngAfterContentInit() {

    this.getData();

  }

 getData(){
    this.logBars = new Array();
    this.allLogs = new Array();
    console.log('fetching data')
     this.logService.getMacros(this.dateFrom.format('YYYY-MM-DD'), this.dateTo.format('YYYY-MM-DD')).subscribe(
			data => {
				this.allLogs = data;
        this.matchLogs();
			},
			error => { console.log(error);
				this.allLogs = new Array();

			}
		); }

  matchLogs() {
    let pointerDate = this.dateFrom.clone();
    while (pointerDate.isBefore(this.dateTo)) {
       let filtered = 	this.allLogs.filter(i => i.day === pointerDate.format('YYYY-MM-DD'))[0];
       if (filtered){
        this.logBars.push(filtered)
       } else {
        this.logBars.push({'day':pointerDate.format('YYYY-MM-DD')})
       }
       pointerDate.add(1,'day');
    }
  }

  monthBack(){
     this.dateFrom = this.dateFrom.clone().subtract(1, 'months');
     this.dateTo = this.dateFrom.clone().endOf('month');
     this.getData();

  }
  monthForward(){
     this.dateFrom = this.dateFrom.clone().add(1, 'months');
     this.dateTo = this.dateFrom.clone().endOf('month');
     this.getData();
  }




  showPercentage = true;

  getYPosProtein(logEntry) { if (!logEntry || !logEntry.macro ) {return 0} return this.graphHeight - this.graphLegenda - logEntry.macro.protein/2}
  getHeightProtein(logEntry) {if (!logEntry || !logEntry.macro ) {return 0} return logEntry.macro.protein/2}

  getYPosFat(logEntry){if (!logEntry || !logEntry.macro ) {return 0} return this.graphHeight - this.graphLegenda - (logEntry.macro.protein/2 + logEntry.macro.fat/2)}
  getHeightFat(logEntry) {if (!logEntry || !logEntry.macro ) {return 0} return logEntry.macro.fat/2}

  getYPosCarbs(logEntry){if (!logEntry || !logEntry.macro ) {return 0} return this.graphHeight - this.graphLegenda- (logEntry.macro.protein/2 + logEntry.macro.fat/2 + logEntry.macro.carbs/2)}
  getHeightCarbs(logEntry) {if (!logEntry || !logEntry.macro ) {return 0} return logEntry.macro.carbs/2}

 constructor(private logService: LogService) {
	}


  data = [
    {"x":10, "y":100,"r":20,"c":"red"},
    {"x":130, "y":60,"r":40,"c":"green"},
    {"x":360, "y":200,"r":20,"c":"orange"}
        ];


 public showMacros(logEntry){
   if (logEntry.macro) {
    this.infoMacro = logEntry;
   } else {
     this.infoMacro = null;
   }
 }
 clicked(event: any) {
    d3.select(event.target).append('circle')
      .attr('cx', event.x)
      .attr('cy', event.y)
      .attr('r', () => {
        return this.radius;
      })
      .attr('fill', 'red');
}
}
