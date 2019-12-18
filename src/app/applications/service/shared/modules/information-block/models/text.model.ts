interface IText {
  pk: string;
  content: string;
}

export class TextModel implements IText {
  pk: string;
  content: string;

  constructor(obj: IText) {
    Object.assign(this, obj);
  }

}
