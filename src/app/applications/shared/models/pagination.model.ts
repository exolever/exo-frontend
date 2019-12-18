
export class PaginationModel<T> {
  constructor(
    public count?: number,
    public next?: string,
    public previous?: string,
    public results: Array<T> = []
  ) { }

  public getCount(): number {
    return this.count;
  }

  public getNextURL(): string {
    return this.next;
  }

  public getPreviousURL(): string {
    return this.previous;
  }

  public getResults(): Array<T> {
    return this.results;
  }

  public getNextPage(): number | null {
    if (this.next) {
      const regexp = new RegExp('/?page=([^&]*)');
      return Number(regexp.exec(this.next)[1]);
    }
    return null;
  }
}
