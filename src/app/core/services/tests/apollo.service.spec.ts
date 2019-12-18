import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';

import { configTestBed } from '@testing/test.common.spec';
import { ApolloAuthService, LocalStorageService, UrlService } from '@app/core';
import { LocalStorageServiceStub, UrlServiceStub } from '@core/services/stubs';

import { ApolloFakeService } from '../apollo/faker_factories/';
import { ApolloService } from '../apollo/apollo.service';

describe('ApolloService', () => {
  let apolloService: ApolloAuthService;
  let apollo: Apollo;
  let hlink: HttpLink;
  let urlService: UrlService;
  let lStorage: LocalStorageService;
  class ApolloStub {
    query( ...params ) { return true; }
    create( ...params ): void {}
  }

  const moduleDef: TestModuleMetadata = {
    imports: [
      HttpClientTestingModule
    ],
    providers: [
      HttpLink,
      { provide: UrlService, useClass: UrlServiceStub },
      { provide: ApolloService, useClass: ApolloFakeService, deps: [Apollo] },
      { provide: Apollo, useClass: ApolloStub },
      { provide: LocalStorageService, useClasS: LocalStorageServiceStub }
    ]
  };
  configTestBed(moduleDef, false);

  beforeEach(() => {
    apollo = TestBed.get( Apollo );
    hlink = TestBed.get( HttpLink );
    urlService = TestBed.get( UrlService );
    lStorage = TestBed.get( LocalStorageService );
    apolloService = new ApolloAuthService( apollo, hlink, urlService, lStorage );
  });

  it('buildQuery ...', () => {
    const apolloGet = apolloService.getApollo();
    const ValidationEmailQuery = gql`
      query ValidateEmailStatus {
        allConsultants
      }
    `;
    spyOn(apolloGet, 'query').and.returnValue(undefined);
    expect(apolloService.buildQuery(ValidationEmailQuery)).toBeUndefined();
    expect(apolloGet.query).toHaveBeenCalled();
  });

});
