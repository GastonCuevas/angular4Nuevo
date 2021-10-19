export class Sort {
  sortBy: string;
  ascending: boolean;

  constructor(sortBy: string, ascending: boolean) {
    this.sortBy = sortBy;
    this.ascending = ascending;
  }
}
