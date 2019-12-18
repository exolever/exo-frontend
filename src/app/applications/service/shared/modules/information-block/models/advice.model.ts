interface IAdvice {
  pk: string;
  order: number;
  description: string;
}

export class AdviceModel implements IAdvice {
  pk: string;
  order: number;
  description: string;

  constructor(obj: IAdvice) {
    Object.assign(this, obj);
  }

}
