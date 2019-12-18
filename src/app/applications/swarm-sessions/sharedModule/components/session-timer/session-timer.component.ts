import { Component, Input, OnDestroy, OnInit, OnChanges, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';

import { interval, Subscription, Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';

import { SessionStatusService } from '../../services/session-status.service';
import { SwarmPromptService } from '../../services/swarm-prompt.service';
import { SwarmSession } from '../../models/session.model';


@Component({
  selector: 'app-session-timer',
  templateUrl: './session-timer.component.html',
  styleUrls: ['./session-timer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionTimerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() inService: boolean;
  @Input() session: SwarmSession;
  @Input() isMobile: boolean;

  timeToShow$: Observable<string>;
  showBox: boolean;
  aboutToExpire: boolean;
  halfSessionPassed: boolean;
  private subscriptions: Subscription[] = [];

  constructor(
    public sessionStatus: SessionStatusService,
    private swarmPromptService: SwarmPromptService
  ) {}

  /** lifecycle hooks */
  ngOnInit() {
    this.setUpTimer();
  }

  setUpTimer() {
    this.timeToShow$ = interval(1000).pipe(
      tap(() => {
        this.showAlert();
        this.showBox = this.isTimerActive();
        this.halfSessionPassed = this.sessionStatus.isMoreThanHalfSessionPassed(this.session);
        this.aboutToExpire = this.sessionStatus.isAboutToExpireSession(this.session);
      }),
      filter(() => this.isTimerActive()),
      map(() => this.getFormattedTime())
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['session'] && !changes['session'].isFirstChange()) {
      this.setUpTimer();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


  private showAlert() {
    if (this.sessionStatus.isSessionExpired(this.session)) {
      const dialog = this.inService ?
        this.swarmPromptService.platformSessionExpiredDialog(this.session) :
        this.swarmPromptService.ecosystemSessionExpiredDialog(this.session);
      this.subscriptions.push(dialog.subscribe());
    }

    if (this.sessionStatus.isSessionStarted(this.session) && !this.sessionStatus.isSessionExpired(this.session)) {
      this.subscriptions.push(
        this.swarmPromptService.platformSessionStartedDialog(this.session).subscribe()
      );
    }
  }


  /**
   * weateher the timer shall be displayed
   */
  private isTimerActive(): boolean {
    return this.sessionStatus.isSessionStarted(this.session) && !this.sessionStatus.isSessionExpired(this.session);
  }

  /**
   * builds the time string to show in the timer
   */
  private getFormattedTime(): string {
    return this.sessionStatus.getHoursLeft(this.session) + ':' +
      // tslint:disable-next-line: max-line-length
      (this.sessionStatus.getMinutesLeft(this.session) < 10 ? '0' : '') + this.sessionStatus.getMinutesLeft(this.session) + ':' +
      // tslint:disable-next-line: max-line-length
      (this.sessionStatus.getSecondsLeft(this.session) < 10 ? '0' : '') + this.sessionStatus.getSecondsLeft(this.session);
  }

}
