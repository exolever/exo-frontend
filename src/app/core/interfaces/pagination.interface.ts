export interface Pagination<T> {
  results: T[];
  next: string;
  previous: string;
  count: string;
}
