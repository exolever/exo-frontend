import { inject, TestModuleMetadata } from '@angular/core/testing';

import * as faker from 'faker';

import { configTestBed } from '@testing/test.common.spec';

import { IndustryModel } from '../models/industry.model';
import { DeserializerConsultantService } from './deserializer-consultant.service';

describe('DeserializerConsultantService', () => {
  const moduleDef: TestModuleMetadata = {
    providers: [DeserializerConsultantService]
  };

  configTestBed(moduleDef, false);

  it('should create', inject([DeserializerConsultantService], (service: DeserializerConsultantService) => {
    expect(service).toBeTruthy();
  }));

  it('should be able to parse languages', inject([DeserializerConsultantService],
    (service: DeserializerConsultantService) => {
      const lang1 = { pk: faker.random.number().toString(), name: faker.lorem.word() };
      const lang2 = { pk: faker.random.number().toString(), name: faker.lorem.word() };
      const response = [lang1, lang2];
      const languages = service.parseLanguages(response);

      expect( languages[0].name ).toEqual(lang1.name);
      expect( languages[1].name ).toEqual(lang2.name);
      expect( languages[1].pk ).toEqual(lang2.pk);
    }));

  it('should be able to parse industries', inject([DeserializerConsultantService],
    (service: DeserializerConsultantService) => {
      const industry1 = { Level: 1, industry: { name: faker.lorem.word() } };
      const industry2 = { Level: 2, industry: { name: faker.lorem.word() } };
      const response = [industry1, industry2];
      let industries: Array<IndustryModel>;
      industries = service.parseIndustries(response);

      expect(industries[0].toString()).toEqual(industry1.industry.name);
      expect(industries[1].toString()).toEqual(industry2.industry.name);
      expect(industries[1].level).toEqual(industry2.Level);
      expect(industries[0].getLevel()).toEqual(industry1.Level);
    }));

  it('should be able to parse Projects ExO Roles', inject([DeserializerConsultantService],
    (service: DeserializerConsultantService) => {
      const projectName = faker.lorem.word();
      const roleName = faker.lorem.word();
      const project = {
        name: projectName,
        typeProject: 'ExO Sprint',
        customer: { name: 'A customer' },
        status: 'I',
        roleName: roleName,
        roles: [{name: roleName, rating: 0}],
        start: new Date(),
        firstDay: new Date()
      };
      const response = [project];
      const projects = service.parseProjects(response, '18');


      expect(projects[0].name).toEqual(projectName);
      expect(projects[0].roles[0]).toEqual(roleName);
    }));

});
