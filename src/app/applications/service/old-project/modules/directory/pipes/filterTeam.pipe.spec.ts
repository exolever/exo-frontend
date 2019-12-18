import { SprintRoleEnum } from '@core/modules/roles/enums/role.enum';

import { MembersByRole, MembersByTeam } from './filterTeam.pipe';
import { FakeConsultantMemberFactory, FakeParticipantMemberFactory } from '../faker_factories';
import { CONSULTANT_MEMBER_TYPE } from '../interfaces';
import { ConsultantMemberModel, ParticipantMemberModel } from '../models';



describe('TeamFilterPipe', () => {
  let userList: Array<ConsultantMemberModel | ParticipantMemberModel>;
  const pipeConsultant = new MembersByRole();
  const pipeTeamMembers = new MembersByTeam();
  const availablesFilters = [SprintRoleEnum.ALIGN_TRAINER_SPRINT.toString(),
    SprintRoleEnum.SPRINT_COACH_SPRINT.toString(),
    '1'];

  beforeEach(() => {
    userList = [];
    // Team1 coach
    userList.push(new FakeConsultantMemberFactory().modelPropertiesCustom([
      { name: 'pkConsultant', data: '1' },
      { name: 'teams', data: ['1'] }
    ]));
    // Head Coach
    userList.push(new FakeConsultantMemberFactory().modelPropertiesCustom([
      { name: 'roleCode', data: SprintRoleEnum.HEAD_COACH_SPRINT.toString() }]));
    // Trainer
    userList.push(new FakeConsultantMemberFactory().modelPropertiesCustom([
      { name: 'roleCode', data: SprintRoleEnum.ALIGN_TRAINER_SPRINT.toString() }]));
    // Team1 participants
    userList.push(new FakeParticipantMemberFactory().modelPropertiesCustom([
      { name: 'teams', data: ['1'] }]));
  });

  it('should be able to filter by team', () => {
      // 1 coach and 1 member
      const valueSelected = { value: '1', memberType: '' };
      let response = pipeConsultant.transform(userList, '1', valueSelected, availablesFilters);
      expect(response.length).toEqual(0);
      response = pipeTeamMembers.transform(userList, '1');
      expect(response.length).toEqual(2);
  });

  it('should be able to filter by rol', () => {
      // 1 Coach
      const valueSelected = {
        value: SprintRoleEnum.SPRINT_COACH_SPRINT.toString(),
        memberType: CONSULTANT_MEMBER_TYPE};
      const response = pipeConsultant.transform(
        userList,
        SprintRoleEnum.SPRINT_COACH_SPRINT.toString(),
        valueSelected, availablesFilters);
      expect(response.length).toEqual(1);
  });

  it('should be able to filter by Trainer', () => {
      // 1 Trainer
      const valueSelected = {
        value: SprintRoleEnum.ALIGN_TRAINER_SPRINT.toString(),
        memberType: CONSULTANT_MEMBER_TYPE};
      const response = pipeConsultant.transform(
        userList,
        SprintRoleEnum.ALIGN_TRAINER_SPRINT.toString(),
        valueSelected, availablesFilters);
      expect(response.length).toEqual(1);
  });
});
