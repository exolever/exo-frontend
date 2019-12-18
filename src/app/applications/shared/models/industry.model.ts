export class IndustryModel {
  constructor(public name: string, public level?: number) {
    this.name = name;
    this.level = level;
  }
  toString() {
    return this.name;
  }
  getLevel(): number | undefined {
    return this.level;
  }
  setLevel(level: number): void {
    this.level = level;
  }
}
