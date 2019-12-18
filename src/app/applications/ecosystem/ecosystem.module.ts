// angular
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
// libs
// modules
import { BreadcrumbModule } from '@applications/breadcrumb/breadcrumb.module';
import { EcosystemRoutingModule } from '@applications/ecosystem/ecosystem-routing.module';
import { LoaderModule } from '@loaders/loader.module';
import { OverlayModule } from '@overlay/overlay.module';
import { SharedModule } from '@shared/shared.module';
import { CertificatesModule } from '@applications/certificates/certificates.module';

import { EcosystemNavbarModule } from '../ecosystem-navbar/ecosystem-navbar.module';
import { OpportunitiesModule } from './modules/opportunities/opportunities.module';
import { CirclesModule } from '../circles/circles.module';
import { MyJobsModule } from '../my-jobs/my-jobs.module';
import { ToolsModule } from './modules/tools/tools.module';
import { ResourcesModule } from './modules/resources/resources.module';

// services
import { DirectoryService } from './modules/directory/service/directory.service';
import { CircleService } from '../circles/services/circle.service';
import { FilterOptionsService } from './modules/directory/service/filter.service';
import { ConsentService } from './components/consent/consent.service';
import { MarketPlaceService } from './components/marketplace-conditions/marketplace-contitions.service';
// config
import { DIRECTORY_CONFIG, directoryConfig } from './modules/directory/directory.conf';

// components
import { EcosystemComponent } from './containers/ecosystem.component';
import { EcosystemFooterComponent } from './components/ecosystem-footer/ecosystem-footer.component';
import { ConsentComponent } from './components/consent/consent.component';
import { MarketplaceConditionsComponent } from './components/marketplace-conditions/marketplace-conditions.component';
import { BookDialogComponent } from './components/dialogs/book-dialog/book-dialog.component';
import { CanvasDialogComponent } from './components/dialogs/canvas-dialog/canvas-dialog.component';
import {
  CertificationsDialogComponent
} from './components/dialogs/certifications-dialog/certifications-dialog.component';
import {
  FoundationCertificationDialogComponent
} from './components/dialogs/foundation-certification-dialog/foundation-certification-dialog.component';
import {
  FirstLevelCertificationComponent
} from './components/first-level-certification/first-level-certification.component';

// guards
import { MarketplaceAgreementGuard } from './marketplace-agreement.guard';

@NgModule({
  imports: [
    EcosystemRoutingModule,
    SharedModule,
    LoaderModule,
    OverlayModule,
    CirclesModule,
    EcosystemNavbarModule,
    BreadcrumbModule,
    MyJobsModule,
    OpportunitiesModule,
    ResourcesModule,
    CertificatesModule,
    ToolsModule
  ],
  providers: [
    DirectoryService,
    CircleService,
    {provide: DIRECTORY_CONFIG, useValue: directoryConfig},
    FilterOptionsService,
    ConsentService,
    MarketplaceAgreementGuard,
    MarketPlaceService
  ],
  entryComponents: [
    FoundationCertificationDialogComponent,
    CertificationsDialogComponent,
    CanvasDialogComponent,
    BookDialogComponent,
  ],
  declarations: [
    EcosystemComponent,
    EcosystemFooterComponent,
    ConsentComponent,
    MarketplaceConditionsComponent,
    FirstLevelCertificationComponent,
    FoundationCertificationDialogComponent,
    CertificationsDialogComponent,
    CanvasDialogComponent,
    BookDialogComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EcosystemModule {
}
