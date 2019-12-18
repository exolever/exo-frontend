import { DocumentNode } from 'graphql';
import { EMPTY } from 'rxjs';

import { ApolloAuthService } from '@app/core';

export class ApolloAuthServiceStub {
  buildQuery( query: DocumentNode, variables?: any ): any {
    return EMPTY;
  }
}

export const APOLLO_AUTH_SERVICE_STUB_PROVIDER = {
  provide: ApolloAuthService, useClass: ApolloAuthServiceStub
};
