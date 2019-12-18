// TODO: Use an enum when we update the Typescript version to 2.4
// (TypeScript 2.4 now allows enum members to contain string initializers.)
​
export const CH_FULLTIME = 'F';
export const CH_DAILY = 'D';
export const CH_WEEKLY = 'W';
export const CH_MONTHLY = 'M';
​
export enum ChTimeAvailabilityEnum {
  'PROFILE.AVAILABILITY.FULLTIME' = <any>CH_FULLTIME,
  'PROFILE.AVAILABILITY.DAILY' = <any>CH_DAILY,
  'PROFILE.AVAILABILITY.WEEKLY' = <any>CH_WEEKLY,
  'PROFILE.AVAILABILITY.MONTHLY' = <any>CH_MONTHLY
}
