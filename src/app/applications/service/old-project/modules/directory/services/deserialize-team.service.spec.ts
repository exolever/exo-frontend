import { TestBed, TestModuleMetadata } from '@angular/core/testing';

import * as faker from 'faker';

import { configTestBed } from '@testing/test.common.spec';
import { removeEdgesAcrossResponse } from '@shared/helpers/removeEdges.helper';
import {
  FakeConsultantMemberFactory,
  FakeParticipantMemberFactory
} from '@applications/service/old-project/modules/directory/faker_factories';
import { DeserializeTeamService } from '@applications/service/old-project/modules/directory/services';
import { DeserializerUserService } from '@applications/shared/services/deserializer-user.service';
import { DeserializerConsultantService } from '@applications/shared/services/deserializer-consultant.service';
import { ParticipantMemberModel, ConsultantMemberModel } from '../models';

let data:
  { teams:
      { edges:
          Array<{ node: {
              teamMembers: { edges: Array<{ node: { pk: string }}>},
              coach: {
                pk: string;
              },
              pk: string;
            }}>
      }
  };

describe( 'Service: DeserializeTeamService', () => {
  let service: DeserializeTeamService;

  const moduleDef: TestModuleMetadata = {
    providers: [
      DeserializeTeamService,
      DeserializerUserService,
      DeserializerConsultantService
    ]
  };

  configTestBed(moduleDef, false);

  beforeEach( () => {
    service = TestBed.get( DeserializeTeamService );
    data = { teams: { edges: [] } };
  });

  it( 'should create', () => {
    expect( service ).toBeTruthy();
  });

  it ( 'should correctly parse roles used by consultant', () => {
    const testData: { consultantsRoles: { edges: Array<{ node: { exoRole: { code: string, name: string } } }> } } = {
      consultantsRoles: { edges: [] }
    };
    const edges = testData.consultantsRoles.edges;
    const code1 = faker.random.word();
    const code2 = faker.random.word();
    const name1 = faker.random.word();
    const name2 = faker.random.word();

    edges.push( { node: { exoRole: { code: code1, name: name1 } } } );
    edges.push( { node: { exoRole: { code: code2, name: name2 } } } );

    expect( service.parseRolesUsedByConsultant( testData ) ).toEqual( jasmine.arrayWithExactContents([
      {code: code1, name: name1},
      {code: code2, name: name2}
    ]));
  });

  it ( 'should correctly roles used by user', () => {
    const testData: { usersRoles: { edges: Array<{ node: { exoRole: { code: string, name: string } } }> } } = {
      usersRoles: { edges: [] }
    };
    const edges = testData.usersRoles.edges;
    const code1 = faker.random.word();
    const code2 = faker.random.word();
    const name1 = faker.random.word();
    const name2 = faker.random.word();

    edges.push( { node: { exoRole: { code: code1, name: name1 } } } );
    edges.push( { node: { exoRole: { code: code2, name: name2 } } } );

    expect( service.parseRolesUsedByUser( testData ) ).toEqual( jasmine.arrayWithExactContents([
      {code: code1, name: name1},
      {code: code2, name: name2}
    ]));
  });

  it ( 'should add participant member to team', () => {
    const cleanData = removeEdgesAcrossResponse(data);
    const fakeParticipantsArray: Array<ParticipantMemberModel> = [];

    while ( cleanData.teams.length < 7 ) {
      const code = faker.random.number( 12 ).toString();
      cleanData.teams.push({ teamMembers: [{ pk: code}], coach: { pk: '8' } });
      fakeParticipantsArray.push( new FakeParticipantMemberFactory().modelPropertiesCustom() );
    }

    cleanData.teams.push({ teamMembers: [{ pk: '13' }], coach: { pk: '13' }, pk: '13' });
    fakeParticipantsArray.push( new FakeParticipantMemberFactory( { pk: '13' } ).modelPropertiesCustom() );

    cleanData.teams.forEach(team => {
      service.addTeamsToParticipants( team, fakeParticipantsArray );
    });

    expect ( fakeParticipantsArray.pop().teams.includes( '13' ) ).toBe( true );

  });

  it ( 'should coach member to team', () => {
    const cleanData = removeEdgesAcrossResponse(data);
    const fakeConsultantsArray: Array<ConsultantMemberModel> = [];


    while ( cleanData.teams.length < 7 ) {
      const code = faker.random.number( 12 ).toString();
      cleanData.teams.push({ teamMembers: [{ pk: code }], coach: { pk: '8' }, pk: code } );
      fakeConsultantsArray.push( new FakeParticipantMemberFactory().modelPropertiesCustom() );
    }

    cleanData.teams.push({ teamMembers: [{ pk: '13' }], coach: { pk: '13' }, pk: '13' });
    fakeConsultantsArray.push(
      new FakeParticipantMemberFactory( { pkConsultant: '13' } ).modelPropertiesCustom()
    );

    cleanData.teams.forEach(team => {
      service.addTeamsToCoaches( team, fakeConsultantsArray );
    });

    expect ( fakeConsultantsArray.pop().teams.includes( '13' ) ).toBe( true );

  });

  it ( 'should parse team members', () => {
    const cleanData = removeEdgesAcrossResponse(data);
    const fakeParticipantsArray: Array<ParticipantMemberModel> = [];
    const fakeConsultantsArray: Array<ConsultantMemberModel> = [];

    while ( cleanData.teams.length < 11 ) {
      const code = faker.random.number( 12 ).toString();
      cleanData.teams.push({ teamMembers: [{ pk: code }], coach: { pk: '8' }, pk: code });
      fakeParticipantsArray.push( new FakeParticipantMemberFactory().modelPropertiesCustom() );
      fakeConsultantsArray.push( new FakeConsultantMemberFactory().modelPropertiesCustom() );
    }

    cleanData.teams.push({teamMembers: [{ pk: '13' }], coach: { pk: '13' }, pk: '13'});
    fakeParticipantsArray.push(new FakeParticipantMemberFactory( { pk: '13' } ).modelPropertiesCustom());
    fakeConsultantsArray.push(new FakeConsultantMemberFactory( { pkConsultant: '13' } ).modelPropertiesCustom());

    service.parseTeamMember(cleanData, fakeConsultantsArray, fakeParticipantsArray);

    expect ( fakeParticipantsArray.pop().teams.includes( '13' ) ).toBe( true );
    expect ( fakeConsultantsArray.pop().teams.includes( '13' ) ).toBe( true );
  });

});
