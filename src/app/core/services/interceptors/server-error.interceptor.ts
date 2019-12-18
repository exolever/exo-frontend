import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpRequest, HttpHandler,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, throwError, EMPTY as empty } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AppState } from '@core/store/reducers';
import { Urls } from '@core/services/navigate';
import * as userActions from '@core/store/user/user.action';
import * as errorActions from '@core/store/error/error.action';

import { Error410Service } from './error-410.service';
import { Error403Service } from './error-403.service';


@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private error410Service: Error410Service,
    private error403Service: Error403Service
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 404:
            this.router.navigate([Urls.NOT_FOUND]);
            break;
          case 403:
            if (error.error.classname) {
              this.error403Service.navigate(error);
              return empty;
            } else {
              this.store.dispatch(new userActions.LogoutUser());
            }
            break;
          case 302:
            this.store.dispatch(new userActions.LogoutUser());
            break;
          case 400:
            const err = error.error;
            const errorString = Object.keys(err).map(key => err[key]).map(el => el.join(', '));
            Object.keys(err).map((key, i) => err[key] = errorString[i]);
            this.store.dispatch(new errorActions.AddGlobalError(err));
            return throwError(error);
          case 410:
            this.error410Service.navigate(error);
            return empty;
          default:
            return throwError(error);
        }
      })
    );
  }
}
