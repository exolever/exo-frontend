import {catchError, first, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {select, Store} from '@ngrx/store';

import {Observable, of} from 'rxjs';
import * as MomentTZ from 'moment-timezone';

import {AppState} from '@core/store/reducers';
import {ApiResources, UrlService} from '@core/services';
import {buildConsultantModel, ConsultantModel, PaginationModel, SearchModel} from '@applications/shared/models';
import {UserPictureModel} from '@core/models/user/user-picture.model';
import {UserApplicationModel} from '@applications/shared/models/user-application.model';
import { UserCertificationModel, CertificateModel } from '@core/models/user/user-certification.model';

import * as fromDirectoryLibrary from '../store/directory.reducer';
import {getValueEnum} from '@shared/helpers/enum.helper';
import {ConsultantStatusEnum} from '@applications/shared/enums';

@Injectable()
export class DirectoryService {

  constructor(
    private urlService: UrlService,
    private authHttp: HttpClient,
    private store: Store<AppState>
  ) {
  }

  /**
   * gets the users for display in the directory of the app
   * @returns {Observable<PaginationModel<ConsultantModel>>}
   */
  getDirectory(): Observable<PaginationModel<ConsultantModel>> {
    const search: SearchModel = this.setParamsForRequest();
    const baseUrl = this.urlService.resolveAPI(ApiResources.ECOSYSTEM_MEMBERS);
    const [params, values] = search.getParams();
    const url = this.urlService.resolveGetParams(baseUrl, params, values);

    return this.authHttp.get<any>(url).pipe(
      map(resp => new PaginationModel<ConsultantModel>(
        resp.count,
        resp.next,
        resp.previous,
        this.parseResults(resp.results))
      ),
      catchError(error => of(error))
    );
  }

  setParamsForRequest(): SearchModel {
    let search: SearchModel;
    this.store.pipe(
      first(),
      select(state => fromDirectoryLibrary.getQueryParams(<AppState>state)),
    ).subscribe(state => {
      const filters = {};
      state.filters.forEach(filter => {
        const selectedFilters = filter.options.filter(opt => opt.selected).map(opt => opt.pk);
        // Not send the filter for status_staff when the user click in All
        if (selectedFilters.length > 0 &&
          (( filter.name !== 'status_staff') ||
          (!selectedFilters.includes(getValueEnum(ConsultantStatusEnum, ConsultantStatusEnum.E))))
        ) {
          filters[filter.slug] = this.escapeChar(selectedFilters);
        }
      });
      search = new SearchModel(
        state.page,
        state.pageSize,
        state.searchTerms,
        state.sortBy,
        state.order,
        filters
      );
    });
    return search;
  }

  private parseResults(results: Array<any>): Array<ConsultantModel> {
    return results.map(result => {
      // Deserialize user application
      const user = this.deserializeUser(result);
      // Build consultant from user and deserialize the desired information
      const consultant = buildConsultantModel(user);
      this.deserializeConsultant(consultant, result);
      return consultant;
    });
  }

  private deserializeUser(obj: any): UserApplicationModel {
    const user = new UserApplicationModel(obj.user_pk);
    user.fullName = obj.fullName;
    user.slug = obj.slug;
    user.location = obj.location;
    user.created = MomentTZ(obj.registered).utc();
    user.profilePictures = obj.profilePictures ? obj.profilePictures.map(pic => new UserPictureModel(pic)) : [];
    user.isOpenExOMember = obj.isStaff;
    user.userTitle = obj.userTitle;
    return user;
  }

  private deserializeConsultant(consultant: ConsultantModel, obj: any): void {
    consultant.certifications = obj.certifications ? this.parseCertifications(obj.certifications) : [];
    consultant.projectsNumber = obj.numProjects;
    consultant.purpose = obj.purpose;
  }

  private parseCertifications(certifications: Array<any>): Array<UserCertificationModel> {
    return certifications.map(certification => {
      const certificates = certification.certificates.map(certificate => {
        return new CertificateModel(
          certificate.name,
          certificate.pdf,
          certificate.accredibleUrl,
          certificate.image,
          MomentTZ(certificate.issueOn).utc());
      });
      return new UserCertificationModel(
        certification.code,
        certification.name,
        certification.description,
        certification.level,
        certificates);
    });
  }

  private escapeChar(selectedFilters: string[]) {
    return selectedFilters.map(filter => filter.replace('&', encodeURIComponent('&')));
  }
}
