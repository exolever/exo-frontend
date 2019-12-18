import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { QueryModel, ApolloAuthService } from '@core/services';

import { ConsultantModel } from '../models/consultant.model';
import { buildConsultantModel } from '../models/helpers.casting';
import { UserApplicationModel } from '../models/user-application.model';
import { DeserializerConsultantService } from './deserializer-consultant.service';
import { DeserializerUserService } from './deserializer-user.service';
import { UserQueryBuilderService } from './user-query-builder.service';
import { ConsultantQueryBuilderService } from './consultant-query-builder.service';

@Injectable()
export class ConsultantDetailService {

  constructor(
    private apollo: ApolloAuthService,
    private deserializerConsultant: DeserializerConsultantService,
    private deserializerUser: DeserializerUserService,
    private builder: UserQueryBuilderService,
    private consultantBuilder: ConsultantQueryBuilderService
  ) { }

  private createConsultantQuery(): QueryModel {
    const query = new QueryModel('allConsultants');
    query.declareFilters({ '$id': 'String' });
    query.applyFilter({ 'pk': '$id' });
    return query;
  }
  private getConsultantInfoQuery() {
    const query = this.createConsultantQuery();
    const firstNode = query.addSchema();
    firstNode.addField('pk');
    this.consultantBuilder.addIndustriesNode(firstNode);
    this.consultantBuilder.addLanguagesNode(firstNode);
    const userNode = this.builder.addUserNode(firstNode);
    userNode.addMultipleNode('socialNetworks').addFields(['networkType', 'value']);

    // Transform the query into Graph syntax
    return query.toGraphQL();
  }

  getConsultantInfo(pk: string): Observable<ConsultantModel> {
    const filtersGraphQL = { 'id': pk };
    const query = this.getConsultantInfoQuery();
    return this.apollo.buildQuery(query, filtersGraphQL).pipe(map(obj =>
      obj.data['allConsultants'].edges.map(con => this.parseResponseGraphQL(con.node))[0]
    ));
  }

  getConsultantTimezone(pk: string): Observable<string> {
    const query = this.createConsultantQuery();
    const firstNode = query.addSchema();
    const userNode = firstNode.addSingleNode('user');
    userNode.addField('timezone');
    return this.apollo.buildQuery(query.toGraphQL(), { 'id': pk }).pipe(map(obj =>
      obj.data['allConsultants'].edges[0].node.user.timezone
    ));
  }

  parseResponseGraphQL(obj): ConsultantModel {
    const user: UserApplicationModel = this.deserializerUser.user(obj.user);
    const consultant = buildConsultantModel(user);
    consultant.setPkConsultant(obj.pk);
    consultant.setLanguages(this.deserializerConsultant.parseLanguages(obj.languages));
    consultant.setIndustries(this.deserializerConsultant.parseIndustries(obj.industries));
    consultant.setSocialNetworks(this.deserializerUser.parseSocialNetworks(obj.user.socialNetworks));
    return consultant;
  }

}
