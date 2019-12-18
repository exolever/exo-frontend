import { Injectable } from '@angular/core';
import { removeEdges } from '@shared/helpers/removeEdges.helper.ts';
import { IndustryModel, LanguageModel } from '@applications/shared/models';

const BADGE_STATUS_COMPLETED = 'C';

@Injectable({
  providedIn: 'root'
})
export class DeserializerConsultantService {

  parseLanguages(langList: Array<any>): Array<LanguageModel> {
    return removeEdges(langList).map(lang => {
      const obj = lang.node ? lang.node : lang;
      return new LanguageModel(obj.name, obj.pk);
    });
  }

  parseIndustries(industries: Array<any>): Array<IndustryModel> {
    return removeEdges(industries).filter(i => i.Level > 0).map(industry_level => {
      return new IndustryModel(industry_level.industry.name, industry_level.Level);
    });
  }

  /** TODO: delete this methods once we stop supporting the tool */
  parseProjects(projects: Array<any>, userPk?: string): Array<any> {
    const projectFound = removeEdges(projects).map(project => {
      let averageProjectRatings;
      if (userPk && project.roles) {
        const userMatchProjectsRatings = project.roles
          .filter( role => role.rating !== 0 && role.badge && role.badge.status === BADGE_STATUS_COMPLETED )
          .map( nodeWithRating => nodeWithRating.rating );
        averageProjectRatings = userMatchProjectsRatings.length ?
          (userMatchProjectsRatings.reduce( (a, b) => a + b ) / userMatchProjectsRatings.length) :
          undefined;

        return {
          customer: project.customer.name,
          name: project.name,
          rating: averageProjectRatings,
          roles: project.roles.map( role => role.name ),
          start: project.start,
          status: project.status,
          type: project.typeProject,
        };
      }
    });
    return typeof projectFound === 'undefined' ? [] : projectFound;
  }
}
