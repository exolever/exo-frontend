import { Injector, NgModule } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Overlay, OverlayContainer } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { BreakpointObserver } from '@angular/cdk/layout';

import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogConfig,
  MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
  MatCommonModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatIconRegistry,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBar,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule, MatBadgeModule,
} from '@angular/material';


import { SnackBarFactory } from '@shared/factories/custom-MatSnackBar.factory';
import { MatPopoverModule } from '@shared/components/popover';
import { socialNetworkType } from '@applications/shared/models/social-network.model';
import { DomSanitizer } from '@angular/platform-browser';

export function MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY(overlay: Overlay, platform: Platform) {
  // Hack for mobile: Prevent that click(tap) work like scroll instead of select item with panel opened.
  // https://github.com/angular/material2/issues/5187#issuecomment-324371834
  return () => platform.IOS ? overlay.scrollStrategies.block() : overlay.scrollStrategies.reposition();
}

@NgModule({
  imports: [
    MatCommonModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatPopoverModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
  ],
  exports: [
    MatCommonModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatPopoverModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
  ],
  providers: [
    { provide: MatSnackBar,
      useFactory: SnackBarFactory,
      deps: [ Overlay, LiveAnnouncer, Injector, BreakpointObserver ]
    },
    {
      provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
      useFactory: MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY,
      deps: [Overlay, Platform]
    },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {
      ...new MatDialogConfig(),
      ...{
        panelClass: 'exo-platform',
        maxWidth: '90vw',
        maxHeight: '90vh'
      }
    }}
  ]
})

export class AngularMaterialModule {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private overlayContainer: OverlayContainer
  ) {
    // Indicate the theme for overlayContainers.
    this.overlayContainer.getContainerElement().classList.add('exo-platform');
    /** icon registered here will be available app wide */
    this.iconRegistry.addSvgIcon(
      socialNetworkType.facebook.toString(),
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/facebook.svg')
    );
    this.iconRegistry.addSvgIcon(
      socialNetworkType.linkedin.toString(),
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/linkedin.svg')
    );
    this.iconRegistry.addSvgIcon(
      socialNetworkType.medium.toString(),
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/medium.svg')
    );
    this.iconRegistry.addSvgIcon(
      socialNetworkType.skype.toString(),
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/skype.svg')
    );
    this.iconRegistry.addSvgIcon(
      socialNetworkType.twitter.toString(),
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/twitter.svg')
    );
  }
}
