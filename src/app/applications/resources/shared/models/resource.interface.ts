import { IResource } from './resource.model';

export interface IBuildApiData {
  name: string;
  data: any;
}

export interface IAddResource {
  getApiData(): Array<IBuildApiData>;
  addResource(resource: IResource): void;
}
export interface IDeleteResource {
  getSlug(): string;
  deleteResource(resource?: IResource): void;
  undoResource(resource: IResource): void;
}
export interface IListResource {
  getResources(): Array<IResource>;
  hasResources(): boolean;
}
