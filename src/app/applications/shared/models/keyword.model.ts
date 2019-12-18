export class KeywordModel {
  public pk?: string;
  public level?: number;

  constructor(public name: string) {
    this.name = name;
  }
  setPk(pk): void {
    this.pk = pk;
  }
  setLevel(level: number): void {
    this.level = level;
  }
  getLevel(): number | undefined {
    return this.level;
  }
  toString(): string {
    return this.name;
  }
}
