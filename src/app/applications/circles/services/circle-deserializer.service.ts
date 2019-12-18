import { Injectable } from '@angular/core';

import { CertificationsDeserializerService } from '@core/modules/certifications/services';

import { Circle } from './../models/circle.model';

@Injectable({
  providedIn: 'root'
})
export class CircleDeserializerService {

  constructor(
    private certificationsDeserializerService: CertificationsDeserializerService
  ) { }

  deserialize(data): Circle {
    const circle = new Circle(data);
    circle.certificationRequired = circle.certificationRequired
      ? this.certificationsDeserializerService.deserialize(circle.certificationRequired)
      : undefined;
    return circle;
  }
}
