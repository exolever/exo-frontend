import {
  Component, OnInit, Input, Output, EventEmitter, OnChanges,
  AfterViewInit, ViewChild, ElementRef, OnDestroy
} from '@angular/core';

import { fromEvent as observableFromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

import { itemListAnimation } from '@animations/item-list.animation';
import { ResourcesService } from '@resources/shared/services';
import { IResource } from '@resources/shared/models';
import { ConfigListResources } from '@resources/shared/config';
import { TypeListEnum } from '@resources/shared/enums';

@Component({
  selector: 'app-list-resources',
  templateUrl: './list-resources.component.html',
  styleUrls: ['./list-resources.component.scss'],
  animations: [itemListAnimation]
})
export class ListResourcesComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() dataModelResource: any;
  @Input() uploadingResourceList = [];
  @Input() configListResources: ConfigListResources = new ConfigListResources();
  @Input() forceRefreshInformation: boolean;
  @Output() resourceDeleted: EventEmitter<IResource> = new EventEmitter();
  // read: ElementRef added because otherwise it returns Material directive instead of ElementRef
  @ViewChild( 'resourcesList', { static: false, read: ElementRef } ) resourcesList: ElementRef;
  listResources: Array<IResource>;
  progressBar = false;
  typeListEnum = TypeListEnum;
  typeListToShow: TypeListEnum;
  private subs: Subscription;
  private listResourcesDomChipsContainers: Array<any>;

  constructor( private resourcesService: ResourcesService ) {}

  ngOnInit() {
    this.typeListToShow = this.configListResources.typeElement;
  }

  ngOnChanges() {
    if (this.uploadingResourceList.length > 0) {
      this.listResources = this.uploadingResourceList;
      this.showProgressBar();
      this.listResourcesDomChipsContainers = [];
    } else {
      this.listResources = this.dataModelResource.getResources();
      this.hideProgressBar();
    }
  }

  ngAfterViewInit() {
    if ( this.resourcesList ) {
      this.listResourcesDomChipsContainers = [];

      this.listResourcesDomChipsContainers =
        this.addEllipsableClassToLastElementOfLine( this.listResourcesDomChipsContainers );

      // timeout to prevent the trigger to shoot too often with resize event
      this.subs = observableFromEvent( window, 'resize' ).pipe(throttleTime( 50 )).subscribe( _ => {
        this.listResourcesDomChipsContainers =
          this.addEllipsableClassToLastElementOfLine( this.listResourcesDomChipsContainers );
      });
    }
  }

  ngOnDestroy() {
    if ( this.subs ) { this.subs.unsubscribe(); }
  }

  deleteResource(resource: IResource) {
    this.resourcesService.deleteTags(resource, [this.dataModelResource.getSlug()])
      .subscribe(() => {
        this.dataModelResource.deleteResource(resource);
        this.resourceDeleted.emit(resource);
        this.listResources = this.dataModelResource.getResources();
      });
  }

  showProgressBar() {
    this.progressBar = true;
  }

  hideProgressBar() {
    this.progressBar = false;
  }

  addEllipsableClassToLastElementOfLine( listResourcesDomChipsContainers: Array<any> ): Array<any> {
    const className = 'ellipsable';
    const parentList = this.resourcesList.nativeElement.querySelectorAll( 'mat-chip-list' );
    let chipOffsetTop: number;

    listResourcesDomChipsContainers =
      this.getAllChipContainers( parentList, listResourcesDomChipsContainers );

    // iterate over all chips containers and check if next element has line break, if it has, append class
    // to make the current element ellipsable and shrinkable
    listResourcesDomChipsContainers.forEach( chipContainer => {
      if ( chipContainer.length ) { chipOffsetTop = chipContainer[0].offsetTop; }
      chipContainer.forEach( currentChip => {
        // how much can the chip grow above his natural size before loosing the ellipsable class to let the sibling
        // come to the first line again (px)
        const step = 13;
        const nextChip = currentChip.nextElementSibling;
        const previousChip = currentChip.previousElementSibling;
        const currentChipWidthWithoutContent =
          parseInt( getComputedStyle( currentChip ).paddingLeft, 10 ) +
          parseInt( getComputedStyle( currentChip ).paddingRight, 10 ) +
          parseInt( getComputedStyle( currentChip ).borderWidth, 10 ) * 2;

        if ( nextChip ) {
          const spanChildWidth = parseInt ( getComputedStyle ( currentChip.querySelector( 'span' ) ).width, 10 );
          const currentChipNaturalWidth = spanChildWidth + currentChipWidthWithoutContent + step;

          nextChip.offsetTop !== chipOffsetTop ?
            currentChip.classList.add( className ) :
            currentChip.classList.remove( className );

          // this is to prevent chips in the second line to come back from the line break before
          // it is expected
          if ( currentChip.offsetWidth  > currentChipNaturalWidth &&
            ( !previousChip || !previousChip.classList.contains( className ) ) ) {
            currentChip.classList.remove( className );
          }
        } else if ( !currentChip.classList.contains( className ) ) {
          currentChip.classList.add( className );
        }
      });
    });

    return listResourcesDomChipsContainers;
  }

  getAllChipContainers ( parentList: any, listResourcesDomChipsContainers: Array<any> ): Array<any> {
    const isListResourcesDomChipContainersEmpty = listResourcesDomChipsContainers.length === 0;

    if ( isListResourcesDomChipContainersEmpty ) {
      listResourcesDomChipsContainers =
        [].map.call( parentList, node => node.querySelectorAll( 'mat-chip' ) );
    }

    return listResourcesDomChipsContainers;
  }
}
