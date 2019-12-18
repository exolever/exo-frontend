import { Component, OnInit, Input, Inject, OnDestroy } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { IAddResource, IResource } from '../../shared/models';
import { ConfigAddResources, ConfigListResources } from '../../shared/config';
import { ResourcesService } from '../../shared/services';
import { MatSnackBar, MatSnackBarRef } from '@angular/material';
import { IResourceConfig } from '../../resources-config';
import { RESOURCES_CONFIG } from '../../resource.config.service';


@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit, OnDestroy {

  @Input() dataModelAddResource: IAddResource;
  @Input() configAddResource: Array<ConfigAddResources> = [];
  @Input() dataModelListResource: any;
  @Input() configListResources: ConfigListResources;
  @Input() policyAddResources: number;

  public copyConfigAddResources: Array<ConfigAddResources>;
  public uploadingResourceList: Array<IResource> = [];
  private subscriptionSnackBar;
  private policyComponentsAddResources: number;
  private quantityResources: number;
  private snackBarRef: MatSnackBarRef<any>;
  public forceRefreshInformation: boolean;

  constructor(
    private translate: TranslateService,
    private snackBarService: MatSnackBar,
    private resourcesService: ResourcesService,
    @Inject(RESOURCES_CONFIG) private config: IResourceConfig
  ) { }

  ngOnInit() {
    // duration for the snackbar for deleted resource to disappear in milliseconds
    this.setNumberAddResources();
    this.quantityResources = this.dataModelListResource.getResources().length;
    this.openAddResource();
  }

  undoResource(resource: IResource) {
    this.quantityResources--;
    this.openAddResource();
    this.forceRefreshInformation = false;
    this.snackBarRef = this.snackBarService.open(
      this.translate.instant('DIALOGS.DELETED_FILE') + ' ' + resource.name,
      'UNDO');
    this.subscriptionSnackBar = this.snackBarRef.onAction().subscribe(() => {
      this.resourcesService.addTags(resource, [this.dataModelListResource.getSlug()]).subscribe(() => {
        this.dataModelListResource.undoResource(resource);
        this.quantityResources++;
        this.openAddResource();
        this.forceRefreshInformation = true; // ToDo: It's a temporal solution until the refactorization
      });
    });
  }

  resourceUploading(resource: IResource) {
    this.uploadingResourceList.push(resource);
  }

  resourceAdded(resource: IResource) {
    // Reset the uploadingResourceList
    this.uploadingResourceList = [];

    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
    this.quantityResources++;
    this.openAddResource();
  }

  showListResources(): boolean {
    return this.dataModelListResource.hasResources() || this.uploadingResourceList.length > 0;
  }

  // Maximum number of resources you can include (using @ input), by default config.policyAddResources
  setNumberAddResources() {
    this.policyComponentsAddResources = this.policyAddResources ?
      this.policyAddResources : this.config.policyAddResources;
  }

  // To show/hide component/s for adding resources, depending on maximun number of resources and the current one
  openAddResource() {
    this.copyConfigAddResources = this.policyComponentsAddResources > this.quantityResources ?
      this.configAddResource : [];
  }

  hasManyAddConfigureComponent(): boolean {
    return this.copyConfigAddResources.length > 1;
  }

  isOpenAddResource() {
    return this.copyConfigAddResources.length;
  }

  ngOnDestroy() {
    if (this.subscriptionSnackBar) {
      this.subscriptionSnackBar.unsubscribe();
    }
  }

}
