import { NodeModel } from '../apollo/models';
import { QueryModel } from '../apollo/models/query.model';

describe('ApolloModels', () => {
  let query;
  beforeEach(() => {
    query = new QueryModel('test');
  });

  it('Add structure for the query', () => {
    expect(query.addSchema()).toEqual(jasmine.any(NodeModel));
  });
  it('Add pagination information', () => {
    query.setPageInfo({ first: 2, after: '$cursor' });
    const pagination = query.getPaginationInfo();
    expect(pagination).toEqual(' first:2 after:$cursor');
    expect(query.hasPageInfo()).toBeTruthy();
  });
  it('Add a simple node', () => {
    const firstNode = query.addSchema();
    expect(firstNode.addField('id')).toBeUndefined();
    expect(firstNode.schema).toEqual({ 'id': undefined });
  });
  it('Add several simple nodes', () => {
    const firstNode = query.addSchema();
    expect(firstNode.addFields(['id', 'email'])).toBeUndefined();
    expect(firstNode.schema).toEqual({ 'id': undefined, 'email': undefined });
  });
  it('Add an Single node', () => {
    const firstNode = query.addSchema();
    const newNode = firstNode.addSingleNode('user');
    expect(newNode).toEqual(jasmine.any(NodeModel));
    expect(firstNode.schema).toEqual({ 'user': jasmine.any(NodeModel) });
    expect(newNode.isMultiple).toBe(false);
  });
  it('Add a Multiple node', () => {
    const firstNode = query.addSchema();
    const newNode = firstNode.addMultipleNode('invitations');
    expect(newNode).toEqual(jasmine.any(NodeModel));
    expect(firstNode.schema).toEqual({ 'invitations': jasmine.any(NodeModel) });
    expect(newNode.isMultiple).toBe(true);
  });
  it('Humanize the information of node', () => {
    const nodeWithField = new NodeModel();
    nodeWithField.addField('id');
    expect(nodeWithField.toString()).toEqual('id ');

    const nodeWithFields = new NodeModel();
    nodeWithFields.addFields(['id', 'name']);
    expect(nodeWithFields.toString()).toEqual('id name ');

    const nodeUser = new NodeModel();
    nodeUser.addSingleNode('user');
    expect(nodeUser.toString()).toEqual('user {  }');

    const nodeInvitations = new NodeModel();
    nodeInvitations.addMultipleNode('invitations');
    expect(nodeInvitations.toString()).toEqual('invitations { edges{ node {  }}}');
  });
  it('Humanize the information of node with filters', () => {
    query.declareFilters({ '$pk': 'String', '$team_pk': 'String' });
    query.applyFilter({ 'pk': '$pk' });
    expect(query.declaredFilters).toEqual('($pk:String,$team_pk:String)');
    expect(query.appliedFilters).toEqual('(pk:$pk)');

    const firstNode = new NodeModel();
    const nodeWithFilters = firstNode.addMultipleNode('teams');
    nodeWithFilters.applyFilters({ 'pk': '$team_pk' });
    expect(firstNode.toString()).toEqual('teams (pk:$team_pk){ edges{ node {  }}}');
  });
  it('Convert the query to GraphQLQuery', () => {
    query.declareFilters({ '$pk': 'String', '$invitation_pk': 'String' });
    query.applyFilter({ 'pk': '$pk' });

    const firstNode = query.addSchema();
    firstNode.addField('id');
    const nodeUser = firstNode.addSingleNode('user');

    nodeUser.addFields(['id', 'Username']);
    const nodeInvitations = nodeUser.addMultipleNode('invitations');
    nodeInvitations.applyFilters({ 'pk': '$invitation_pk' });
    nodeInvitations.addField('status');
    const nodeInviteUser = nodeInvitations.addSingleNode('inviteUser');

    nodeInviteUser.addField('shortName');

    // tslint:disable-next-line:max-line-length
    const stringQuery = 'query test($pk:String,$invitation_pk:String){test(pk:$pk){ edges { node {id user { id Username invitations (pk:$invitation_pk){ edges{ node { status inviteUser { shortName  } }}} }}}}}';
    const gqlQuery = query.toGraphQL();
    expect(gqlQuery.loc.source.body).toEqual(stringQuery);

    // tslint:disable-next-line:max-line-length
    const stringQueryWithoutEdges = 'query test($pk:String,$invitation_pk:String){test(pk:$pk){id user { id Username invitations (pk:$invitation_pk){ edges{ node { status inviteUser { shortName  } }}} }}}';
    const graphQLquery = query.toGraphQL(true);
    expect(graphQLquery.loc.source.body).toEqual(stringQueryWithoutEdges);

  });
});
