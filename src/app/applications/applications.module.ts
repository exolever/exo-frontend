import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { TypeFormIntegrationComponent } from '@shared/components/typeform-integration/typeform-integration.component';

import { ApplicationsRoutingModule } from './applications-routing.module';
import { ApplicationsComponent } from './applications.component';
import { ResourcesModule } from './resources/resources.module';
import { ApplicationsSharedModule } from './shared/applications-shared.module';
import { MessageComponent } from './messages/messages.component';
import { MessageService } from './messages/messages.service';
import {ResolutionCheckerDirective} from '@shared/components/resolution-checker/resolution-checker.directive';
import {VersionCheckerDirective} from '@shared/components/version-checker/version-checker.directive';

@NgModule({
  imports: [
    SharedModule,
    ApplicationsRoutingModule,
    ApplicationsSharedModule,
    ResourcesModule
  ],
  declarations: [
    ApplicationsComponent,
    MessageComponent,
    ResolutionCheckerDirective,
    VersionCheckerDirective
  ],
  providers: [
    MessageService,
  ],
  entryComponents: [TypeFormIntegrationComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ApplicationsModule { }
