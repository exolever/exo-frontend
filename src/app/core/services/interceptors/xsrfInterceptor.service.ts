import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpXsrfTokenExtractor } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class XsrfInterceptor implements HttpInterceptor {

  constructor(private tokenExtractor: HttpXsrfTokenExtractor) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // To share cookies when the domains are different, you need to specify the field withCredentials.
    req = req.clone({ withCredentials: true });

    // To add the header with the csrfToken.
    const customToken = this.tokenExtractor.getToken() as string;
    if (customToken !== null) {
      req = req.clone({
        setHeaders: {
          'X-CSRFToken': customToken,
        }
      });
    }

    return next.handle(req);
  }
}
