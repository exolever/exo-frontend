import { Injectable } from '@angular/core';
import { NodeModel } from '@core/services';


@Injectable()
export class UserQueryBuilderService {
  addKeywordsNode(node: NodeModel): NodeModel {
    const keywords = node.addMultipleNode('keywords');
    keywords.addFields(['name', 'pk']);
    return keywords;
  }

  addSocialNetworksNode(node: NodeModel): NodeModel {
    const socialNetworksNode = node.addMultipleNode('socialNetworks');
    socialNetworksNode.addFields(['networkType', 'value']);
    return socialNetworksNode;
  }

  addPicturesNode(node: NodeModel): NodeModel {
    const profilePictures = node.addSingleNode('profilePictures');
    profilePictures.addFields(['width', 'height', 'url']);
    return profilePictures;
  }

  addUserNode(node: NodeModel): NodeModel {
    const userNode = node.addSingleNode('user');
    return this.getUserNode(userNode);
  }
  getUserNode(userNode: NodeModel): NodeModel {
    userNode.addFields(
      [
        'pk', 'fullName', 'bioMe',
        'aboutMe', 'shortMe', 'shortName',
        'location', 'timezone',
        'dateJoined', 'slug'
      ]);
    this.addPicturesNode(userNode);
    return userNode;
  }

  addSocialAuthNode(userNode: NodeModel): NodeModel {
    const socialAuthsNode = userNode.addMultipleNode('socialAuth');
    socialAuthsNode.addFields(['provider', 'extraData', 'username', 'publicProfileUrl']);
    return socialAuthsNode;
  }

  addDirectoryUserNode(node: NodeModel): NodeModel {
    const userNode = node.addSingleNode('user');
    return this.getProfileDirectoryNode(userNode);
  }

  getProfileDirectoryNode(userNode: NodeModel): NodeModel {
    userNode.addFields(['pk', 'fullName', 'shortName', 'slug', 'isOpenexoMember']);
    this.addPicturesNode(userNode);
    return userNode;
  }

  addAgreementNode(node: NodeModel): NodeModel {
    const agreementNode = node.addSingleNode('agreement');
    agreementNode.addFields(['name', 'status', 'description', 'version', 'documentPdf']);
    return agreementNode;
  }

}
