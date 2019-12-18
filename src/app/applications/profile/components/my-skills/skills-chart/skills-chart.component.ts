import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { BreakPoint, DEFAULT_BREAKPOINTS, ɵMatchMedia, MediaObserver } from '@angular/flex-layout';

import * as d3 from 'd3-shape';
import { Subscription } from 'rxjs';

import { ConsultantModel } from '@applications/shared/models';
import { WindowRef } from '@app/core';

@Component({
  selector: 'app-skills-chart',
  templateUrl: './skills-chart.component.html',
  styleUrls: ['./skills-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsChartComponent implements OnChanges, AfterViewInit, OnDestroy {

  @Input() profileUser: ConsultantModel;

  /** chart config */
  chartSize: number;
  chartData: Array<any>;
  curve: any;
  colorScheme: { domain: Array<string>} = { domain: []};
  private subscriptions: Array<Subscription> = [];

  constructor (
    private mediaMatch: ɵMatchMedia,
    private mediaObserver: MediaObserver,
    private w: WindowRef,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnChanges() {
    this.curve = d3.curveLinearClosed;
    this.initColors();
    this.populateChartData();
  }

  ngAfterViewInit() {
    this.subscriptions.push(
      this.mediaObserver.media$.subscribe(() => {
        if ( this.mediaMatch.isActive(
          DEFAULT_BREAKPOINTS.find((bp: BreakPoint) => bp.alias === 'lt-lg').mediaQuery
        ) ) {
          this.chartSize = 666;
        } else if ( this.mediaMatch.isActive(
          DEFAULT_BREAKPOINTS.find((bp: BreakPoint) => bp.alias === 'gt-md').mediaQuery
        ) ) {
          this.chartSize = 888;
        }
      })
    );
    if (this.w.nativeWindow.innerWidth >= 1280) {
      this.chartSize = 888;
    } else {
      this.chartSize = 666;
    }
    /** avoid expression changed after it has been checked error */
    this.changeDetector.detectChanges();
  }

  /**
   * populate the chart color scheme
   */
  initColors(): void {
    this.colorScheme = { domain: ['#00c5ff', '#ff7273'] };
  }

  /**
   * populates the chart with the data fetch from the user profile
   */
  populateChartData(): void {
    const mtp = [{ name: 'MTP Design', value: this.profileUser.valueMTP || 0 }];
    const external =
      this.profileUser.getExternalEXOAttributes()
        .map(pos => ({ name: pos.name, value: pos.level }));
    const externalEmpty =
      this.profileUser.getExternalEXOAttributes()
        .map(pos => ({ name: pos.name, value: 0 }));
    const internal =
      this.profileUser.getInternalEXOAttributes()
        .map(pos => ({ name: pos.name, value: pos.level }));
    const internalEmpty =
      this.profileUser.getInternalEXOAttributes()
        .map(pos => ({ name: pos.name, value: 0 }));
    const chartDataSeriesIDEAS = mtp.concat(external).concat(internalEmpty);
    const chartDataSeriesSCALE = internal.concat(mtp).concat(externalEmpty);

    this.chartData = [
      { name: 'IDEAS', series: chartDataSeriesIDEAS },
      { name: 'SCALE', series: chartDataSeriesSCALE }
    ];
  }

  ngOnDestroy() {
    this.subscriptions.forEach( s => s.unsubscribe() );
  }

}
