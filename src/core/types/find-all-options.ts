export interface FindAllOptions {
  page?: number;
  pageSize?: number;
  filterQuery?: string;
  filterByOrQuery?: string;
  searchQuery?: string;
  sortQuery?: string;
  unpaginated?: boolean;
}
