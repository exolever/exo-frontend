import { Component, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { Survey } from '../../store/exq.model';
import { MatDialog } from '@angular/material';
import {
  ShareSurveyDialogComponent
} from '@ecosystem/modules/tools/exq/dialogs/share-survey-dialog/share-survey-dialog.component';
import { ApiResources, UrlService } from '@app/core';
import * as exqActions from '../../store/exq.action';
import { ExqService } from '@ecosystem/modules/tools/exq/service/exq.service';
import { Store } from '@ngrx/store';
import { AppState } from '@core/store/reducers';


@Component({
  selector: 'app-survey-card',
  templateUrl: './survey-card.component.html',
  styleUrls: ['./survey-card.component.scss']
})
export class SurveyCardComponent implements OnDestroy {
  @Input() survey: Survey;
  @Input() current: boolean;
  private subscriptions = new Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private urlService: UrlService,
    private exqService: ExqService,
    private store: Store<AppState>
  ) {
  }

  goToEdit() {

      this.router.navigate([`${(this.current ? '../' : '')}../edit/${this.survey.pk}`], {relativeTo: this.route});
  }

  showResults() {
    const url = this.urlService.getPath([`../${ this.survey.pk }/results`]);
    this.router.navigate([url], {relativeTo: this.route});
  }

  viewSurvey(survey: Survey) {
    const url = `${survey.publicUrl}?lang=${survey.language}&slug=${survey.slug}`;
    window.open(url, '_blank');
  }

  stopPropagation($event: MouseEvent): void {
    $event.stopPropagation();
    $event.preventDefault();
  }

  shareSurvey() {
    this.dialog.open(
      ShareSurveyDialogComponent,
      {
        width: '777px',
        data: this.survey
      }
    );
  }

  onDownloadCSV() {
    const newWindow = window.open('', '_blank');
    newWindow.location.href = this.urlService.resolveExQ(
      ApiResources.EXQ_DOWNLOAD_CSV, this.survey.pk.toString()
    );
  }

  onDeleteSurvey() {
    this.subscriptions.add(this.exqService.onDelete().subscribe(res => {
      this.store.dispatch(new exqActions.DeleteSurvey({pk: this.survey.pk}));
    }));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
