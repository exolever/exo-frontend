export class NodeModel {
  filters;
  private schema;

  constructor(public isMultiple = false) {
    this.schema = {};
    this.filters = '';
  }
  public addField(name: string): void {
    this.schema[name] = undefined;
  }
  public addFields(fields: Array<string>): void {
    for (const field of fields) {
      this.schema[field] = undefined;
    }
  }
  public addSingleNode(name: string): NodeModel {
    const node = new NodeModel();
    node.isMultiple = false;
    this.schema[name] = node;

    return node;
  }
  public addMultipleNode(name: string): NodeModel {
    const node = new NodeModel();
    node.isMultiple = true;
    this.schema[name] = node;
    return node;
  }
  public applyFilters(filters?: any) {
    this.filters = JSON.stringify(filters).replace(/\"/g, '').replace('{', '(').replace('}', ')');
  }
  public toString(): string {
    let stringNodes = '';
    for (const key of Object.keys(this.schema)) {
      const value = this.schema[key];
      stringNodes = stringNodes.concat(key).concat(' ');
      if (value !== undefined) {
        if (value.filters) {
          stringNodes = stringNodes.concat(value.filters);
        }
        if (!value.isMultiple) {
          stringNodes = stringNodes.concat('{ ').concat(value.toString()).concat(' }');
        } else {
          stringNodes = stringNodes.concat('{ edges{ node { ').concat(value.toString()).concat(' }}}');
        }
      }
    }
    return stringNodes;
  }
}
