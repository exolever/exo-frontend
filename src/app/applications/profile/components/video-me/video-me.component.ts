import {
  Component,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';

import { ConsultantModel, SocialNetworkModel, socialNetworkType } from '@applications/shared/models';

@Component({
  selector: 'app-video-me',
  templateUrl: './video-me.component.html',
  styleUrls: ['./video-me.component.scss']
})
export class VideoMeComponent {

  /** template variables */
  readMore = false;

  @Input() profileUser: ConsultantModel;

  @ViewChild('bioWrapper', {static: false}) bioWrapper: ElementRef;
  @ViewChild('bioText', {static: false}) bioText: ElementRef;

  /**
   * toggles the read state of the user bio
   */
  onReadMoreToggle(): void {
    this.readMore = !this.readMore;
  }

  /**
   * weather the bio text can be expanded or not
   * The condition is >= because bioText has top padding so when the value is equal the last line appears cut
   * @returns {boolean}
   */
  canShowMoreBio(): boolean {
    return this.bioText ?
      this.bioText.nativeElement.offsetHeight >= this.bioWrapper.nativeElement.offsetHeight : false;
  }

  /**
   * method that determines the display width of the bio box depending on presence or not of video
   * @returns {string}
   */
  decideBioWidth(): string {
    return this.profileUser.bioMe &&
    ((!this.profileUser.video) || !this.profileUser.isConsultant()) ?
      'grow' :
      '1 1 calc( 66% - 152px )';
  }

  /**
   * Orders social networks
   */
  orderedSocialNetworks(): Array<SocialNetworkModel> {
    const socialNetworkOrderedBuffer: Array<SocialNetworkModel> = [];
    const mappedNetworkCodes = this.profileUser.socialNetworks.map( sn => sn.networkType );

    /** give the appropriate order to the user's social networks array */
    Object.keys(socialNetworkType).forEach(key => {
      if (mappedNetworkCodes.includes( key )) {
        socialNetworkOrderedBuffer.push(this.profileUser.socialNetworks[ mappedNetworkCodes.indexOf(key) ]);
      }
    });
    this.profileUser.socialNetworks = socialNetworkOrderedBuffer;

    return this.profileUser.socialNetworks;
  }

  /**
   * personal website has some unique features that needed to be addressed specifically in the template, we use this
   * method to know if those procedures apply
   */
  socialContactIsPersonalWebsite( socialNetworkName: string ): boolean {
    return socialNetworkName === socialNetworkType.website.toString();
  }

  getSocialPublicNetworks(): SocialNetworkModel[] {
    return this.orderedSocialNetworks().filter(res => res.networkType !== socialNetworkType.skype.toString());
  }
}
