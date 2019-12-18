import { Injectable } from '@angular/core';

import { CertificationModel } from '../models';
import { ICertificationResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CertificationsDeserializerService {

  deserialize(data: ICertificationResponse | ICertificationResponse[]): any {
    return data instanceof Array
      ? data.map((certificationData: ICertificationResponse) => this.createCertification(certificationData))
      : this.createCertification(data);
  }

  private createCertification(data: ICertificationResponse): CertificationModel {
    return new CertificationModel(
      data.code,
      data.name,
      data.description,
      data.level,
    );
  }
}
