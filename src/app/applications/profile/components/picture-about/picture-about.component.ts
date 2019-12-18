import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnChanges,
  OnDestroy
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { ConsultantModel, UserApplicationModel } from '@applications/shared/models';
import { capitalize } from '@shared/utils/capitalize';
import { PROFILE_VIEW_CONFIG } from '../../profile-view.config';

@Component({
  selector: 'app-picture-about',
  templateUrl: './picture-about.component.html',
  styleUrls: ['./picture-about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PictureAboutComponent implements OnChanges, OnDestroy {

  @Input() profileUser: UserApplicationModel | ConsultantModel;
  // language display management
  languages: Array<{name: string, referenceName: string}> = [];

  private subscription: Subscription = new Subscription();

  constructor(
    @Inject(PROFILE_VIEW_CONFIG) public config,
    private http: HttpClient,
    private chDetectorRef: ChangeDetectorRef
  ) {}

  ngOnChanges() {
    this.subscription.add(this.http
      .get<Array<{name: string, referenceName: string}>>( this.config.routeToLanguages )
      .subscribe( (langObj: Array<{name: string, referenceName: string}>) => {
        const langs = this.getLanguagesFromConsultant( langObj );
        if (langs) {
          this.languages = langs;
        }
        this.chDetectorRef.detectChanges();
      })
    );
  }

  /**
   * check if profile user is consultant and has languages
   * @returns {Array<{name: string, referenceName: string}>}
   */
  getLanguagesFromConsultant( langObj: Array<{name: string, referenceName: string}> ): any {
    return (this.profileUser instanceof ConsultantModel && (<ConsultantModel>this.profileUser).languages) ?
      this.profileUser.languages.map( singleLang => {
        const filter = langObj.filter( l => l.referenceName === capitalize(singleLang.name))[0];
        return filter ? filter : {name: singleLang.name, referenceName: singleLang.name};
      }) : undefined;
  }

  hasMtp(): boolean {
    return (this.profileUser instanceof ConsultantModel) && this.profileUser.mtp !== '';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
