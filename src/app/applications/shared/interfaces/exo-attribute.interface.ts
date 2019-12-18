export const CH_INTERNAL_EXO_ATTRIBUTE = 'I'; // Ideas
export const CH_EXTERNAL_EXO_ATTRIBUTE = 'S'; // Scope

export enum ExOAttributeType {
  CH_INTERNAL_EXO_ATTRIBUTE = <any>'Ideas',
  CH_EXTERNAL_EXO_ATTRIBUTE = <any>'Scope',
}

export interface IExOAttribute {
  pk?: string;
  name: string;
  level: number;
  type?: string;
}
