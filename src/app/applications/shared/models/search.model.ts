import { OrderEnum } from '../enums/order.enum';

export interface SearchConfig {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  order?: any;
  filters?: Map<string, string[]>;
}

export class SearchModel implements SearchConfig {

  constructor(
    public page,
    public pageSize,
    public search?,
    public sortBy?,
    public order?,
    public filters?) { }

  public getParams(): [Array<string>, Array<string>] {
    const params = ['page', 'page_size'];
    const values = [this.page, this.pageSize];

    // Manage ordering
    if (this.sortBy) {
      params.push('sort');
      values.push(this.sortBy.split(',').map((field) => this.order === OrderEnum.Asc ? field : `-${field}`));
    }
    // Manage search field
    if (this.search) {
      params.push('search');
      values.push(this.search);
    }
    // Manage filters
    if (this.filters) {
      Object.keys(this.filters).forEach(key => {
        params.push(key);
        values.push(this.filters[key]);
      });
    }

    return [params, values];
  }

}
