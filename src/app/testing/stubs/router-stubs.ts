export { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Component, Directive, HostListener, Injectable, Input } from '@angular/core';
import { NavigationExtras } from '@angular/router';

import { BehaviorSubject, EMPTY, Observable } from 'rxjs';

@Directive({
  selector: '[routerLink]',
})
export class RouterLinkStubDirective {
  navigatedTo: any = null;
  @Input('routerLink') linkParams: any;
  @HostListener('click') onClick() {
    this.navigatedTo = this.linkParams;
  }
}

@Component({ selector: 'router-outlet', template: '' })
export class RouterOutletStubComponent { }

@Injectable()
export class RouterStub {
  navigate(commands: any[], extras?: NavigationExtras) { }
}


@Injectable()
export class ActivatedRouteStub {
  /** fake fragment property of activated route */
  fragment: Observable<any> = EMPTY;
  // ActivatedRoute.params is Observable
  private subject = new BehaviorSubject(this.testParams);
  params = this.subject.asObservable();
  paramMap = this.subject.asObservable();
  // Test parameters
  private _testParams: {};
  get testParams() {
    return this._testParams;
  }
  set testParams(params: {}) {
    this._testParams = params;
    this.subject.next(params);
  }

  // ActivatedRoute.queryParams is Observable
  private querySubject = new BehaviorSubject(this.testQueryParams);
  queryParams = this.subject.asObservable();

  // Test parameters
  private _testQueryParams: {};
  get testQueryParams() { return this._testQueryParams; }
  set testQueryParams(queryParams: {}) {
    this._testQueryParams = queryParams;
    this.querySubject.next(queryParams);
  }


  // Data parameters --> Information from resolvers
  private subjectData = new BehaviorSubject(this.testDataParams);
  data = this.subjectData.asObservable();

  private _testDataParams: {};
  get testDataParams() { return this._testDataParams; }
  set testDataParams(data: {}) {
    this._testDataParams = data;
    this.subjectData.next(data);
  }

  // Fragment parameters --> URL fragment
  private fragmentData = new BehaviorSubject(this.testFragmentParams);
  fragmentParams = this.fragmentData.asObservable();

  private _testFragmentParams: string;
  get testFragmentParams() { return this._testFragmentParams; }
  set testFragmentParams(data: string) {
    this._testFragmentParams = data;
    this.fragmentData.next(data);
  }

  // ActivatedRoute.snapshot
  get snapshot() {
    return {
      params: this.testParams,
      data: this.testDataParams,
      queryParams: this.testQueryParams,
      fragment: this.testFragmentParams,
      children: [],
      parent: {
        url: [{ path: ''}],
        parent: {
          url: [{ path: ''}],
          parent: {
            url: [{ path: ''}]
          }
        }
      }
    };
  }

}


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
