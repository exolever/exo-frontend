import { ElementRef } from '@angular/core';

import { ConsultantModel } from '@applications/shared/models/consultant.model';

/**
 * Define the estructure which manage the EcosystemSearcherComponent
 */
export interface IEcosystemSearcherConsultant {
  consultant: ConsultantModel;
  canBeDeleted?: boolean;
  template?: ElementRef;
}

/**
 * Define the extra options for consultats once we want to display them
 */
export interface IEcosystemSearcherConsultantOptions {
  consultantPk: string;
  canBeDeleted?: boolean;
  template?: ElementRef;
}
