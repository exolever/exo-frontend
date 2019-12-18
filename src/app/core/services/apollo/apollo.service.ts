import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { Apollo, ApolloBase } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import { HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { DocumentNode } from 'graphql';
import { Observable } from 'rxjs';

import { UrlService, ApiResources } from '../api/resolve';
import { LocalStorageService } from '../localStorage.service';

export abstract class AbstractApolloService {

  /**
   * children of this service pass to the abstract class weather the Apollo API is publicly accessible or not
   */
  constructor(
    private apollo: Apollo,
    private isPublicApollo = false
  ) {}
  /**
   * This method only must be used for the queries in the resolvers. It returns an observable
   */
  buildQuery( query: DocumentNode, variables?: any ): Observable<ApolloQueryResult<any>> {
    return this.getApolloContext().query({
      query: query,
      variables: variables,
      fetchPolicy: 'network-only'
    });
  }
  /**
   * This method is the common method to use Apollo. Return an ApolloQueryObservable.
   * By default will do the fetch ignoring the cache data.
   */
  buildWatchQuery( query: DocumentNode, variables?: any ): Observable<ApolloQueryResult<any>> {
    return this.getApolloContext().watchQuery({
      query: query,
      variables: variables,
      fetchPolicy: 'network-only'
    }).valueChanges;
  }

  resetCacheApollo() {
    return this.getApolloContext().getClient().resetStore();
  }

  getApolloContext(): ApolloBase<any> {
    /**
     * if we want to use multiple clients of Apollo, they cannot collide, so we must provide alias
     * we choose to provide an alias for the public one since it's the one that has less use
     */
    return this.isPublicApollo ? this.apollo.use( 'public' ) : this.apollo;
  }

  getApollo() {
    return this.apollo;
  }

}

/** Unauthenticated Apollo requests */
@Injectable()
export class ApolloService extends AbstractApolloService {

  constructor( apollo: Apollo, httpLink: HttpLink, urlService: UrlService ) {
    apollo.create( {
      link: httpLink.create({ uri: urlService.resolve( ApiResources.PUBLIC_GRAPHQL )}),
      cache: new InMemoryCache()
    }, 'public');
    super( apollo, true );
  }

}

/** Authenticated Apollo requests */
@Injectable()
export class ApolloAuthService extends AbstractApolloService {

  constructor( apollo: Apollo, httpLink: HttpLink, urlService: UrlService, lStorage: LocalStorageService ) {
    const http = httpLink.create({ uri: urlService.resolveAPI( ApiResources.GRAPHQL )});

    const middleware = setContext(() => ({
      headers: new HttpHeaders().set('Authorization', lStorage.getToken() || null)
    }));

    // use with Apollo.create()
    const linkWithMiddlewareContext = middleware.concat(http);

    apollo.create( {
      link: linkWithMiddlewareContext,
      cache: new InMemoryCache()
    });
    super( apollo );
  }

}
