import {NgModule} from '@angular/core';

import {ActivitiesFormService} from './services/activities-form.service';
import {ConsultantDetailService} from './services/consultant-detail.service';
import {ConsultantListService} from './services/consultant-list.service';
import {ConsultantQueryBuilderService} from './services/consultant-query-builder.service';
import {DeserializerConsultantService} from './services/deserializer-consultant.service';
import {DeserializerUserService} from './services/deserializer-user.service';
import {IndustriesService} from './services/industries.service';
import {KeywordService} from './services/keywords.service';
import {LanguageService} from './services/languages.service';
import {LocationsService} from './services/locations.service';
import {ResourcesQueryBuilderService} from './services/resources-query-builder.service';
import {StoreModule} from '@ngrx/store';
import {UserQueryBuilderService} from './services/user-query-builder.service';
import {reducers} from '@applications/service/old-project/store/project';
import {ActivitiesConfigurationService} from './services/activities-configuration.service';
@NgModule({
  imports: [
    StoreModule.forFeature('projects', reducers),
  ],
  providers: [
    ActivitiesFormService,
    ConsultantDetailService,
    ConsultantListService,
    ConsultantQueryBuilderService,
    DeserializerConsultantService,
    DeserializerUserService,
    IndustriesService,
    KeywordService,
    LanguageService,
    LocationsService,
    ResourcesQueryBuilderService,
    UserQueryBuilderService,
    ActivitiesConfigurationService,
  ]
})
export class ApplicationsSharedModule {
}
