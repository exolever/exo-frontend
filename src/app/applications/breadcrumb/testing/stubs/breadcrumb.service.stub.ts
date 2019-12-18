import { BreadCrumbService } from '@applications/breadcrumb/service/breadcrumb.service';

class BreadCrumbServiceStub {}

export const breadCrumbServiceStubProvider = {
  provide: BreadCrumbService, useClass: BreadCrumbServiceStub
};
