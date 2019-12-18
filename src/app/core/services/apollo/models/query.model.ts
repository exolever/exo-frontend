import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';

import { NodeModel } from './node.model';


interface QueryInterface {
  name: string;
  operation?: string;
  node: NodeModel;
}

export interface PaginationInterface {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
}

export class QueryModel implements QueryInterface {
  public node;
  public operation;

  private declaredFilters = '';
  private appliedFilters = '';
  private pageInfo = false;
  private totalCount = false;
  private pagination: PaginationInterface;

  constructor(public name: string, operation?: string) {
    this.name = name;
    this.operation = operation ? operation : name;
  }
  addSchema(): NodeModel {
    this.node = new NodeModel();
    return this.node;
  }

  applyFilter(filters): void {
    this.appliedFilters = JSON.stringify(filters).replace(/\"/g, '').replace('{', '(').replace('}', ')');
  }

  declareFilters(filters): void {
    this.declaredFilters = JSON.stringify(filters).replace(/\"/g, '').replace('{', '(').replace('}', ')');
  }

  getPaginationInfo(): string {
    let query = '';
    if (this.pagination.first) {
      query = query.concat(' first:' + this.pagination.first);
    }
    if (this.pagination.last) {
      query = query.concat(' last:' + this.pagination.last);
    }
    if (this.pagination.after) {
      query = query.concat(' after:' + this.pagination.after);
    }
    if (this.pagination.before) {
      query = query.concat(' before:' + this.pagination.before);
    }
    return query;
  }

  setPageInfo(pagination: PaginationInterface): void {
    this.pageInfo = true;
    this.pagination = pagination;
  }

  hasPageInfo(): boolean {
    return this.pageInfo;
  }

  setTotalCount(): void {
    this.totalCount = true;
  }

  hasTotalCount(): boolean {
    return this.totalCount;
  }

  toGraphQL(omitEdges = false): DocumentNode {
    let paginationQuery = '';
    let query = 'query '.concat(this.name);
    if (this.declaredFilters) {
      query = query.concat(this.declaredFilters);
    }
    query = query.concat('{').concat(this.operation);

    if (this.pagination) {
      paginationQuery = this.getPaginationInfo();
    }
    if (this.appliedFilters) {
      let filters = this.appliedFilters;
      if (this.pagination) {
        filters = filters.replace(')', ', ' + paginationQuery + ')');
      }
      query = query.concat(filters);
    } else {
      if (this.pagination) {
        query = query.concat('(' + paginationQuery + ')');
      }
    }
    if (omitEdges) {
      query = query.concat('{').concat(this.node.toString());
    } else {
      query = query.concat('{ edges { node {').concat(this.node.toString()).concat('}}');
    }

    if (this.hasPageInfo()) {
      query = query.concat(' pageInfo { hasNextPage hasPreviousPage startCursor endCursor }');
    }
    if (this.hasTotalCount()) {
      query = query.concat(' totalCount');
    }
    query = query.concat('}}');
    return gql`${query}`;
  }
}
