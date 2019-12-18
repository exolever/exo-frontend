import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { capitalize } from '@shared/utils/capitalize';
import { QueryModel, ApolloAuthService, UrlService, ApiResources } from '@core/services';

import { ConsultantModel, buildConsultantModel, UserApplicationModel } from '../../shared/models';
import { DeserializerUserService, UserQueryBuilderService } from '../../shared/services';

@Injectable()
export class AccountUserService {
  constructor (
    private urlService: UrlService,
    private authHttp: HttpClient,
    private apollo: ApolloAuthService,
    private deserializerUser: DeserializerUserService,
    private userBuilder: UserQueryBuilderService
  ) {}

  getUserInfo( pkUser: string ): Observable<UserApplicationModel | ConsultantModel> {
    const operationName = 'allUsers';
    const query = this.buildQuery( operationName );
    const filters = { 'pk': pkUser };

    return this.apollo.buildQuery( query, filters ).pipe(map( res => {
      return this.parseResponse( res.data[ operationName ].edges[0].node );
    }));
  }

  getNotifications(pkUser: string): Observable<any> {
    const url = this.urlService.resolveAPI(ApiResources.USER_NOTIFICATIONS, pkUser);
    return this.authHttp.get(url);
  }

  changeNotifications(pkUser: string, pkNotification: string, value: boolean) {
    const url = this.urlService.resolveAPI(ApiResources.USER_NOTIFICATION_UPDATE, pkUser, pkNotification);
    return this.authHttp.post(url, {value: capitalize(`${value}`)});
  }

  private buildQuery( opName: string ) {
    const query = new QueryModel( opName );
    query.declareFilters({ '$pk': 'String' });
    query.applyFilter({ 'pk': '$pk' });
    const firstNode = query.addSchema();
    firstNode.addFields(['pk', 'id', 'email', 'permissions', 'fullName', 'shortName']);
    const consultantNode = firstNode.addSingleNode('consultant');
    consultantNode.addFields(['pk', 'id']);
    consultantNode
      .addSingleNode('exoProfile')
      .addSingleNode('contractingData')
      .addFields(['name', 'address', 'companyName', 'taxId']);

    this.userBuilder.addPicturesNode(firstNode);

    return query.toGraphQL();
  }

  private parseResponse(data): UserApplicationModel | ConsultantModel {
    let profileUser;
    profileUser = this.deserializerUser.user(data);
    profileUser.setPermissions(data.permissions);
    if (data.consultant && data.consultant.pk) {
      profileUser = <ConsultantModel>buildConsultantModel(profileUser);
      profileUser.setPkConsultant(data.consultant.pk);
      if (data.consultant.exoProfile.contractingData) {
        profileUser.setLegalData(data.consultant.exoProfile.contractingData);
      }
    }
    return profileUser;
  }
}
