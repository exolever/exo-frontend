import { Injectable } from '@angular/core';

import * as MomentTZ from 'moment-timezone';

import { removeEdges } from '@shared/helpers/removeEdges.helper.ts';
import { UserPictureModel } from '@core/models/user/user-picture.model';

import { UserApplicationModel } from '../models/user-application.model';
import { SocialNetworkModel } from '../models/social-network.model';
import { SocialAuthModel } from '../models/social-auth.model';
@Injectable()
export class DeserializerUserService {

  user(user: any): UserApplicationModel {
    let userObj: any;
    let userModel: UserApplicationModel;
    userObj = removeEdges(user);
    userModel = new UserApplicationModel(userObj.pk);
    userModel.fullName = userObj.fullName;
    userModel.uuid = userObj.uuid;
    userModel.slug = userObj.slug;
    userModel.shortName = userObj.shortName;
    userModel.bioMe = userObj.bioMe;
    userModel.aboutMe = userObj.aboutMe;
    userModel.shortMe = userObj.shortMe;
    userModel.location = userObj.location;
    userModel.timezone = userObj.timezone;
    // userModel.emailContact = userObj.emailContact;
    userModel.created = userObj.dateJoined ? MomentTZ(userObj.dateJoined).utc() : undefined;
    userModel.passwordUpdated = userObj.passwordUpdated;
    userModel.profilePictures = userObj.profilePictures ?
      userObj.profilePictures.map(pic => new UserPictureModel(pic)) : [];
    userModel.email = userObj.email;
    userModel.permissions = userObj.permissions;
    userModel.isOpenExOMember = userObj.isOpenexoMember;
    return userModel;
  }

  parseSocialNetworks(socialNetworks: Array<any>): Array<SocialNetworkModel> {
    return removeEdges(socialNetworks).map(k => {
      const obj = k.node ? k.node : k;
      const social = new SocialNetworkModel();
      social.set({
        pk: obj.pk,
        created: obj.created ? MomentTZ(obj.created).utc() : undefined,
        modified: obj.modified ? MomentTZ(obj.modified).utc() : undefined,
        networkType: obj.networkType ? obj.networkType : undefined,
        value: obj.value ? obj.value : undefined
      });
      return social;
    });
  }

  parseSocialAuths(socialAuths: Array<any>): Array<SocialAuthModel> {
    return removeEdges(socialAuths).map(k => {
      const obj = k.node ? k.node : k;
      const auth = new SocialAuthModel();
      auth.provider = obj.provider;
      auth.extraData = JSON.parse(obj.extraData);
      auth.username = obj.username;
      auth.publicProfileUrl = obj.publicProfileUrl;
      return auth;
    });
  }

}
