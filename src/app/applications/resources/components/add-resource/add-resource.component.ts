import { Component, OnInit, Input, ViewContainerRef, Inject, Output, EventEmitter } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatDialog } from '@angular/material';

import { TranslateService } from '@ngx-translate/core';

import { ResourcesService, DeserializeResourceService } from '../../shared/services';
import { IResource, IAddResource, IBuildApiData } from '../../shared/models';
import { ConfigAddResources } from '../../shared/config';
import { TypeElementArea } from '../../shared/enums';
import { FileSizePipe } from '../../shared/pipes';
import { IResourceConfig } from '../../resources-config';
import { RESOURCES_CONFIG } from '../../resource.config.service';
import { LinkDialogComponent } from '../link-dialog/link-dialog.component';

@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styleUrls: ['./add-resource.component.scss']
})
export class AddResourceComponent implements OnInit {

  @Input() dataModelResource: IAddResource;
  @Input() configAddResource: ConfigAddResources = new ConfigAddResources();
  @Output() resourceUploading: EventEmitter<IResource> = new EventEmitter();
  @Output() resourceAdded: EventEmitter<IResource> = new EventEmitter();

  public typeElementShow: TypeElementArea;
  public typeElementArea = TypeElementArea;
  private resource: IResource;
  private configSnackBar: MatSnackBarConfig;
  private maxFileSize: number;
  private dataForm: Array<IBuildApiData> = [];

  constructor(
    private translate: TranslateService,
    private fileSizePipe: FileSizePipe,
    private _snackBarService: MatSnackBar,
    public viewContainerRef: ViewContainerRef,
    private resourcesService: ResourcesService,
    private dialog: MatDialog,
    private deserializeResourceService: DeserializeResourceService,
    @Inject(RESOURCES_CONFIG) private config: IResourceConfig
  ) { }

  ngOnInit() {
    this.maxFileSize = this.config.maxFileSize;
    this.configSnackBar = new MatSnackBarConfig();
    this.configSnackBar.viewContainerRef = this.viewContainerRef;
    this.configSnackBar.duration = this.config.timeSnackBar;
    this.hideProgressBar();
  }

  eventFile(event): void {
    if (event.target) {
      const fileList: FileList = event.target.files || event.srcElement.files;
      for (let i = 0; i < fileList.length; i++) {
        this.uploadFile(fileList.item(i));
      }
    } else {
      this.uploadFile(event);
    }
  }

  uploadFile(file) {
    if (file.size > this.maxFileSize) {
      this._snackBarService.open(
        this.translate.instant('DIALOGS.FILE_LARGER') + ' ' + this.fileSizePipe.transform(this.maxFileSize),
        'Retry', this.configSnackBar);
    } else {
      this.resourceUploading.emit(this.deserializeResourceService.deserializeResource(file));
      this.dataModelResource.getApiData().map(data => this.dataForm.push(data));
      this.dataForm.push({ name: 'file', data: file });
      this.resourcesService.upload(this.dataForm).subscribe(resp => {
        this.resource = this.deserializeResourceService.deserializeResource(resp);
        this.dataModelResource.addResource(this.resource);
        this.hideProgressBar();
        this.resourceAdded.emit(this.resource);
      });
      this.showProgressBar();
    }
  }

  uploadLink(link) {
    this.dataModelResource.getApiData().map(data => this.dataForm.push(data));
    this.dataForm.push({ name: 'name', data: link.name });
    this.dataForm.push({ name: 'link', data: link.link });
    this.resourcesService.upload(this.dataForm).subscribe(resp => {
      this.resource = this.deserializeResourceService.deserializeResource(resp);
      this.dataModelResource.addResource(this.resource);
      this.hideProgressBar();
    });
  }

  showProgressBar() {
    if (this.configAddResource.availableProgressBar) {
      this.typeElementShow = TypeElementArea.progressBar;
    } else {
      this.typeElementShow = TypeElementArea.empty;
    }
  }

  hideProgressBar() {
    this.typeElementShow = this.configAddResource.typeElement;
  }

  openLinkDialog(): void {
    const dialogRef = this.dialog.open(LinkDialogComponent, { width: '630px' });
    dialogRef.afterClosed().subscribe(result => result ? this.uploadLink(result) : false);
  }
}
