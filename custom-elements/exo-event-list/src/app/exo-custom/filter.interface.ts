export interface ConfigSelect {
  search: boolean;
  placeholder: string;
  moreText: string;
  height: string;
  noResultsFound: string;
}

export interface IFilters {
  country: string[];
  languages: string[];
  followType: string[];
  category: string[];
}
