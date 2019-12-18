import { Component, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';

import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';
import { AppState } from '@core/store/reducers';

import { Circle } from '../../models/circle.model';
import * as CirclesActions from '../../store/action/circles.action';

@Component({
  selector: 'app-circles-shortcuts',
  templateUrl: './circles-shortcuts.component.html',
  styleUrls: ['./circles-shortcuts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CirclesShortcutsComponent implements OnDestroy {
  @Input() circles: Circle[] = [];
  subscriptions = new Subscription();

  constructor(
    private promptDialogService: PromptDialogService,
    private translate: TranslateService,
    private store: Store<AppState>,
  ) {}

  onClick() {
    // Tracking: (ActionGA.CreateFromList, {
    //   label: CategoryGA.Circles,
    //   category: CategoryGA.Circles
    // })
  }

  showMenu(circle: Circle): boolean {
    return this.canPost(circle) || this.canEdit(circle) || this.canLeave(circle);
  }

  canPost(circle: Circle): boolean {
    return circle.canPost && !circle.isGuest();
  }

  canEdit(circle: Circle): boolean {
    return circle.canEdit;
  }

  canLeave(circle: Circle): boolean {
    return circle.canLeave;
  }

  leaveCircle(circle: Circle) {
    this.subscriptions.add(
      this.promptDialogService
        .open({
          title: this.translate.instant('ECOSYSTEM.CIRCLES.ALERT_LEAVE_CIRCLE.MESSAGE'),
          secondaryButton: this.translate.instant('COMMON.CANCEL'),
          primaryButton: this.translate.instant('ECOSYSTEM.CIRCLES.ALERT_LEAVE_CIRCLE.ACTION')
        }).pipe(filter(value => value === true))
        .subscribe(() => {
          this.store.dispatch(new CirclesActions.LeaveCircle(circle));
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
