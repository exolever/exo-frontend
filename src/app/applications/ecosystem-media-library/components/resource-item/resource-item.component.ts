import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Output, EventEmitter} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {filter, tap} from 'rxjs/operators';
import {Subscription} from 'rxjs';

import {FilestackService} from '@core/services/filestack.service';
import {PrivacyType, Resource, ResourceType} from '@ecosystem-media-library/store/resource.model';
import {IResourceActions, ResourceActions} from '@ecosystem-media-library/ecosystem-media-library.conf';
import {PromptDialogService} from '@shared/modules/prompt-dialog/prompt-dialog.service';

@Component({
  selector: 'app-resource-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './resource-item.component.html',
  styleUrls: ['./resource-item.component.scss']
})
export class ResourceItemComponent implements OnInit, OnDestroy {
  /** TODO fix typing once old media library is deleted */
  @Input() resource: Resource;
  @Input() showActions: boolean;
  @Input() showPrivacy: boolean;
  @Output() sendAction = new EventEmitter<{action: ResourceActions, resource: Resource}>();

  thumbnailIcon: string;
  thumbnailRectangle: string;
  actions: IResourceActions[];
  actionsEnum = ResourceActions;
  private subscription = new Subscription();

  constructor(
    private translate: TranslateService,
    private promptDialogService: PromptDialogService,
    private filestackService: FilestackService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.filestackService.init();
    this.layoutThumbnail();
    this.configActions();
  }

  configActions() {
    this.actions = [{
      action: ResourceActions.DELETE,
      text: this.translateService.instant('MEDIA.DELETE'),
      thumbnail: 'delete'
    }];
  }

  layoutThumbnail() {
    switch ( this.resource.type ) {
      case ResourceType.Video:
        this.thumbnailIcon = 'fa-arrows-alt';
        this.resource.thumbnail = 'pdf.png';
        break;
      case ResourceType.Links:
        this.thumbnailIcon = 'fa-link';
        this.resource.thumbnail = 'pdf.png';
        break;
      case ResourceType.Pdf:
        this.thumbnailIcon = 'fa-download';
        this.thumbnailRectangle = 'thumbnail-rectangle__pdf';
        this.resource.thumbnail = 'pdf.png';
        break;
      case ResourceType.Document:
        this.thumbnailIcon = 'fa-download';
        this.thumbnailRectangle = 'thumbnail-rectangle__document';
        this.resource.thumbnail = 'doc.png';
        break;
      case ResourceType.Slides:
        this.thumbnailIcon = 'fa-download';
        this.thumbnailRectangle = 'thumbnail-rectangle__slides';
        this.resource.thumbnail = 'slides.png';
        break;
      case ResourceType.Form:
        this.thumbnailIcon = 'fa-download';
        this.thumbnailRectangle = 'thumbnail-rectangle__form';
        this.resource.thumbnail = 'pdf.png';
        break;
      case ResourceType.Spreadsheet:
        this.thumbnailIcon = 'fa-download';
        this.thumbnailRectangle = 'thumbnail-rectangle__spreadsheet';
        this.resource.thumbnail = 'spreadsheet.png';
        break;
      case ResourceType.Image:
        this.thumbnailIcon = 'fa-download';
        this.resource.thumbnail = 'pdf.png';
        break;
    }
  }

  openPicker() {
    this.filestackService.open();
  }

  doAction(action: ResourceActions) {
    switch ( action ) {
      case ResourceActions.DELETE:
        this.subscription.add(this.promptDialogService.open({
          title: this.translate.instant('MEDIA.DELETE_FILE_PROMPT.TITLE'),
          secondaryButton: this.translate.instant('COMMON.CANCEL'),
          primaryButton: this.translate.instant('COMMON.DELETE')
        }).pipe(
          filter((result) => result === true),
          tap(() => this.sendAction.emit({action: action, resource: this.resource}))
        ).subscribe());
        break;
      default:
        this.sendAction.emit({action: action, resource: this.resource});
        break;
    }
  }

  isPrivate() {
    return PrivacyType.Private;
  }

  showToggle() {
    return this.showPrivacy && this.resource.visibility && this.resource.canChangeVisibility;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
