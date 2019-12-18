import { Injectable } from '@angular/core';

import * as MomentTZ from 'moment-timezone';

import { removeDuplicatesFromArray } from '@shared/utils/array-remove-duplictes';
import {
  IConsultantBackendResponse, IProjectFieldResponse, IUserApplicationBackendResponse
} from '@applications/shared/interfaces/user-consultant-backend-response.interface';
import { ActivityModel } from '@applications/shared/models/activity.model';
import { EXPERIENCE_HUMANIZE } from '@applications/shared/interfaces/areas-expertise.interface';
import { IExOAttribute } from '@applications/shared/interfaces';
import { IndustryModel } from '@applications/shared/models/industry.model';
import { KeywordModel } from '@applications/shared/models/keyword.model';
import { LanguageModel } from '@applications/shared/models/language.model';
import { UserPictureModel } from '@core/models/user/user-picture.model';
import { ProjectsRoles } from '@applications/shared/interfaces/projects-roles.interface';
import { SocialNetworkModel } from '@applications/shared/models/social-network.model';
import { BadgeActivityModel, BadgeModel } from '@applications/shared/models/badge.model';
import { BadgeResponseInterface } from '@applications/shared/interfaces/badge.interface';
import { CertificateModel, UserCertificationModel } from '@core/models/user/user-certification.model';
import { SprintRoleEnum } from '@core/modules/roles/enums/role.enum';

@Injectable()
export class UserAndConsultantResponseDigestService {

  digestResponseAndBuildUserApplicationData(initializer: IUserApplicationBackendResponse, consultant?: any): any {
    const obj: any = {};
    Object.assign(obj, initializer);
    obj['pk'] = initializer.pk ?
      initializer.pk.toString() :
      console.error('No primary key sent from backend REST endpoint');
    obj['profilePictures'] =
      initializer.profilePictures ?
        initializer.profilePictures
          .map(pic => new UserPictureModel({ height: pic.height, width: pic.width, url: pic.url})) :
        [];
    obj['created'] = initializer.dateJoined ? MomentTZ(initializer.dateJoined).utc() : undefined;
    obj['socialNetworks'] = initializer.socialNetworks ? this.parseSocialNetworks(initializer.socialNetworks) : [];
    if (consultant) {
      obj['consultant'] = consultant;
    }

    return obj;
  }

  digestAndBuildConsultantDataFromProfileRequestResponse(initializer: IConsultantBackendResponse): any {
    const obj: any = {};
    initializer = this.preventUndefinedArrayProperties(initializer);

    obj['pkConsultant'] = initializer.consultant.pk.toString();
    obj['industries'] =
      initializer.consultant.industries
        .map(industry => new IndustryModel(industry.industry.name, industry.level));
    obj['languages'] =
      initializer.consultant.languages.map( language => new LanguageModel( language.name, language.id ));
    obj['rolesWithProjects'] = this.parseRolesWithProjects(initializer.consultant.roles, initializer.roles);
    obj['projectsNumber'] = initializer.numProjects;
    obj['exoAttributes'] = this.parseExOAttributes(initializer.consultant.exoAttributes);
    obj['keywords'] = this.parseKeywords(initializer.consultant.keywords);
    obj['technologies'] = this.parseKeywordsTagged(initializer.consultant.keywords, 'technology');
    obj['expertises'] = this.parseKeywordsTagged(initializer.consultant.keywords, 'expertise');
    obj['exoAreas'] = initializer.consultant.exoAreas.map(a => a.exoArea.code);
    obj['certifications'] = initializer.consultant.certifications
      ? this.parseCertifications(initializer.consultant.certifications)
      : [];
    obj['badgesActivity'] = initializer.badgesActivity ? this.parseBadges(initializer.badgesActivity) : [];
    if ( initializer.consultant.exoProfile ) {
      const exoProfile = initializer.consultant.exoProfile;
      obj['mtp'] = exoProfile.personalMtp;
      obj['valueMTP'] = exoProfile.mtpMastery;
      obj['availability'] = exoProfile.availability ? exoProfile.availability.toString() : null;
      obj['availabilityHours'] = exoProfile.availabilityHours || null;
      obj['areasExpertise'] =
        exoProfile.areasExpertise ? exoProfile.areasExpertise.map(e => EXPERIENCE_HUMANIZE[e]) : [];
      obj['activities'] = this.parseActivities(exoProfile.exoActivities);
      obj['consultantPermissions'] = initializer.consultant.permissions;
      obj['video'] = initializer.consultant.exoProfile.videoUrl;
    }
    return this.digestResponseAndBuildUserApplicationData(initializer, obj);
  }

  private parseCertifications(certifications: Array<any>): Array<UserCertificationModel> {
    return certifications.map(certification => {
      const certificates = certification.certificates.map(certificate => {
        return new CertificateModel(
          certificate.name,
          certificate.pdf,
          certificate.accredibleUrl,
          certificate.image,
          MomentTZ(certificate.issueOn).utc());
      });
      return new UserCertificationModel(
        certification.code,
        certification.name,
        certification.description,
        certification.level,
        certificates);
    });
  }

  /**
   * obtain the badges available for the user
   * @returns {Array<BadgeModel>}
   * @param badges
   */
  private parseBadges(badges: Array<BadgeResponseInterface>): Array<BadgeModel> {
    return badges.map(badge => {
      const activities = badge.items.map(activity => {
        return new BadgeActivityModel(
          activity.name,
          MomentTZ(activity.date).utc());
      });
      return new BadgeModel(
        badge.code,
        badge.category,
        badge.num,
        badge.order,
        MomentTZ(badge.created).utc(),
        activities);
    });
  }

  /**
   * obtain the social networks available for the user
   * @param {Array<any>} socialNetworks
   * @returns {Array<SocialNetworkModel>}
   */
  private parseSocialNetworks(socialNetworks: Array<any>): Array<SocialNetworkModel> {
    return socialNetworks.map(k => {
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

  /**
   * sets to empty arrays some properties that might arrive as undefined
   * @param initializer
   */
  private preventUndefinedArrayProperties(initializer: IConsultantBackendResponse): IConsultantBackendResponse {
    initializer.consultant.industries = initializer.consultant.industries ? initializer.consultant.industries : [];
    initializer.consultant.languages = initializer.consultant.languages ? initializer.consultant.languages : [];
    initializer.consultant.roles = initializer.consultant.roles ? initializer.consultant.roles : [];
    initializer.consultant.roles = initializer.consultant.roles ? initializer.consultant.roles : [];
    initializer.consultant.exoAttributes =
      initializer.consultant.exoAttributes ? initializer.consultant.exoAttributes : [];
    initializer.consultant.keywords = initializer.consultant.keywords ? initializer.consultant.keywords : [];
    initializer.consultant.exoAreas = initializer.consultant.exoAreas ? initializer.consultant.exoAreas : [];

    return initializer;
  }

  /**
   * roles parser
   * @param {Array<any>} roles
   * @param rolesUser Delivery manager roles come from User instead Consultant.
   */
  private parseRolesWithProjects(roles: Array<any>, rolesUser?: Array<any>): Array<ProjectsRoles> {
    if (rolesUser) {
      roles = this.addUserToRolesWithProject(roles, rolesUser);
    }
    /** make a copy of the read only object provided by the response */
    let parsedRoles: ProjectsRoles[] = this.rolesBuilder(roles);
    /** sort array of roles by projects */
    parsedRoles = parsedRoles.sort((a, b) => +a.project.pk - +b.project.pk);
    /** merge all punctuations of repeated projects */
    this.mergeRepeatedProjectRating(parsedRoles);
    return this.removeDuplicateProjectsAndJoinRoles(parsedRoles);
  }

  /**
   * DeliveryManager isn't a role, is a badge in the model data, but we want show as role and show project with
   * this badge and filter by them in the profile.
   * @param roles
   * @param rolesUser
   */
  private addUserToRolesWithProject(roles, rolesUser) {
    rolesUser.forEach((rol) => {
      if (rol.role === SprintRoleEnum.DELIVERY_MANAGER_SPRINT) {
        rol.rating = null;
        rol.role = {
          id: undefined,
          name: SprintRoleEnum.toString(SprintRoleEnum.DELIVERY_MANAGER_SPRINT),
          code: SprintRoleEnum.DELIVERY_MANAGER_SPRINT.toString()
        };
      }
    });
    return roles.concat(rolesUser);
  }

  /**
   * creates a copy of the response transforming it into the adequate format
   * @param {Array<any>} res
   */
  private rolesBuilder(res: Array<any>): Array<ProjectsRoles> {
    const rolesCopy: ProjectsRoles[] = [];
    res.forEach( role => {
      rolesCopy.push({
        project: this.buildProject(role.project),
        roles: [role.role],
        badge: role.badge,
        rating: role.rating,
        status: role.status
      });
    });
    return rolesCopy;
  }

  /**
   * takes a backend response from a project and adds the timezone creation function to it's timestamps
   * @param project
   */
  private buildProject(project: IProjectFieldResponse): any {
    return {
      ...project,
      firstDay: MomentTZ(project.firstDay).startOf('day'),
      start: MomentTZ(project.start).startOf('day')
    };
  }

  /**
   * method used to build the consultant attributes object from response
   * @param attributes
   */
  private parseExOAttributes(attributes: Array<any>): Array<IExOAttribute> {
    return attributes.map(att => ({
      name: att.exoAttribute.name,
      type: att.exoAttribute.type,
      level: att.level,
      pk: att.pk
    }));
  }

  private parseKeywords(keywords: any): KeywordModel[] {
    return keywords.map(k => {
      const newKeyword = new KeywordModel(k.keyword.name);
      newKeyword.setLevel(k.level);
      return newKeyword;
    });
  }

  /**
   * this method receives the property name of a certain type of keyword and digests the data
   * to return the object according to the consultant model pertaining to that type of keyword
   * @param keywords
   * @param nameTag
   */
  private parseKeywordsTagged(keywords, nameTag: string): KeywordModel[] {
    const keywordsTagged = [];
    keywords.forEach(k => {
      if ((k.keyword.tags.filter(tag => tag.name === nameTag)).length) {
        const newKeyword = new KeywordModel(k.keyword.name);
        newKeyword.setLevel(k.level);
        keywordsTagged.push(newKeyword);
      }
    });
    return keywordsTagged;
  }

  private parseActivities(activities: Array<any>): Array<ActivityModel> {
    return activities ? activities.map(activity => {
      return new ActivityModel(
        activity.exoActivity.name,
        activity.status,
        activity.exoActivity.code,
        activity.exoActivity.description,
        activity.exoActivity.order);
    }) : [];
  }

  /**
   * merges the ratings of all roles withing repeated projects
   * @returns {number}
   */
  private mergeRepeatedProjectRating(rolesWithProject: Array<ProjectsRoles>): void {
    const pkProjects = removeDuplicatesFromArray(rolesWithProject.map(roles => roles.project.pk));

    pkProjects.forEach(pk => {
      let averageProjectRating = 0;
      const ratedRoles = rolesWithProject.filter(role => role.project.pk === pk && role.rating !== null);

      if ( ratedRoles.length ) {
        averageProjectRating = ratedRoles
          .map( ratedRole => ratedRole.rating )
          .reduce((a, b) => a + b) / ratedRoles.length;
        averageProjectRating = Math.round( averageProjectRating * 10 ) / 10;
        rolesWithProject
          .filter(role => role.project.pk === pk)
          .forEach( role => role.rating = averageProjectRating );
      }
    });
  }

  /**
   * We ask for all the roles of the user and then receive the project of each role, but some of them are duplicated
   * projects in which the user has participated with different roles, in this method we eliminate those duplicated
   * projects and collect all the different roles that the user has had in that particular project in it's roles array
   */
  private removeDuplicateProjectsAndJoinRoles(rolesWithProject: Array<ProjectsRoles>): Array<ProjectsRoles> {
    for (let i = 0; i < rolesWithProject.length; i++) {
      if ( rolesWithProject[i + 1] && rolesWithProject[i].project.pk === rolesWithProject[i + 1].project.pk ) {
        /** merge repeated project into a single one */
        rolesWithProject[i].roles.push(rolesWithProject[i + 1].roles[0]);
        /** remove repeated project */
        rolesWithProject.splice(i + 1, 1);
        /** apply recursiveness */
        rolesWithProject = this.removeDuplicateProjectsAndJoinRoles(rolesWithProject);
        break;
      }
    }

    return rolesWithProject;

  }

}
