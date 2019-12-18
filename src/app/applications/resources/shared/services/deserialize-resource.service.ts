import { Injectable } from '@angular/core';
import { IResource } from '../models/';

@Injectable()
export class DeserializeResourceService {
  deserializeResource(obj): IResource {
    return {
      created: obj.created ? obj.created : null,
      extension: obj.extension ? obj.extension : null,
      pk: obj.pk ? obj.pk : obj.id,
      isFile: obj.is_file ? obj.is_file : obj.isFile,
      isLink: obj.is_link ? obj.is_link : obj.isLink,
      link: obj.link ? obj.link : null,
      mimetype: obj.mimetype ? obj.mimetype : null,
      modified: obj.modified ? obj.modified : null,
      name: obj.name ? obj.name : null,
      publicTags: obj.publicTags ? obj.publicTags : obj.public_tags,
      type: obj.type ? obj.type : null,
      url: obj.url ? obj.url : null,
    };
  }
  deserializeResources(resp): Array<IResource> {
    return resp.map(resource => this.deserializeResource(resource.node));
  }
}
