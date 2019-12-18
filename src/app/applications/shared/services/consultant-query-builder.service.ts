import { Injectable } from '@angular/core';
import { NodeModel } from '@core/services';

@Injectable()
export class ConsultantQueryBuilderService {

  addConsultantNode(node: NodeModel): NodeModel {
    const consultantNode = node.addSingleNode('consultant');
    consultantNode.addFields(['id', 'pk', 'permissions', 'videoUrl']);
    return consultantNode;
  }

  addExOAttributesNode(node: NodeModel): NodeModel {
    const exOAttributeNode = node.addMultipleNode('exoAttributes');
    exOAttributeNode.addFields(['Level', 'pk']);
    exOAttributeNode.addSingleNode('exoAttribute').addFields(['name', 'Type']);
    return exOAttributeNode;
  }

  addExOProfile(node: NodeModel): NodeModel {
    const exoProfileNode = node.addSingleNode('exoProfile');
    exoProfileNode.addFields([
      'personalMtp', 'MtpMastery',
      'availability', 'availabilityHours', 'areasExpertise', 'wantedRoles']);
    this.addActivities(exoProfileNode);
    return exoProfileNode;
  }

  addActivities(node: NodeModel): NodeModel {
    const activitiesNode = node.addMultipleNode('exoActivities');
    activitiesNode.addField('status');
    const exoActivity = activitiesNode.addSingleNode('exoActivity');
    exoActivity.addFields(['name', 'code', 'order', 'description', 'requireCertification']);
    return activitiesNode;
  }

  addIndustriesNode(node: NodeModel): NodeModel {
    const industriesNode = node.addMultipleNode('industries');
    industriesNode.addField('Level');
    industriesNode.addSingleNode('industry').addField('name');
    return industriesNode;
  }

  addLanguagesNode(node: NodeModel): NodeModel {
    const languages = node.addMultipleNode('languages');
    languages.addFields(['name', 'pk']);
    return languages;
  }

  addRolesNode(node: NodeModel): NodeModel {
    const rolesNode = node.addMultipleNode('roles');
    rolesNode.addFields(['rating', 'status', 'roleName']);
    rolesNode.addSingleNode('badge').addField('status');
    rolesNode.addSingleNode('role').addFields(['name', 'code']);

    const projectsNode = rolesNode.addSingleNode('project');
    projectsNode.addFields(['pk', 'name', 'typeProject', 'start', 'firstDay', 'status']);
    projectsNode.addSingleNode('customer').addField('name');

    return rolesNode;
  }

  addKeywordsNode(node: NodeModel): NodeModel {
    const keywordNode = node.addMultipleNode('keywords');
    keywordNode.addField('Level');
    const kNode = keywordNode.addSingleNode('keyword');
    kNode.addField('name');
    kNode.addMultipleNode('tags').addField('name');
    return keywordNode;
  }

  addAreasNode(node: NodeModel): NodeModel {
    const areaNode = node.addMultipleNode('exoAreas');
    const aNode = areaNode.addSingleNode('exoArea');
    aNode.addField('code');
    return areaNode;
  }

  /** TODO delete once no more support for tool is needed */
  toolAddRolesNode(node: NodeModel): NodeModel {
    const rolesNode = node.addMultipleNode('roles');
    rolesNode.addField('rating');
    rolesNode.addSingleNode('badge').addField('status');
    const projectsNode = rolesNode.addSingleNode('project');
    projectsNode.addFields
    (
      ['name', 'typeProject', 'start', 'firstDay']
    );
    const customerProject = projectsNode.addSingleNode('customer');
    customerProject.addField('name');
    rolesNode.addSingleNode('role').addFields(['name', 'code']);
    rolesNode.addField('status');
    // This roleName is the "Frontend" name for ExORoles
    rolesNode.addField('roleName');
    return rolesNode;
  }
}
