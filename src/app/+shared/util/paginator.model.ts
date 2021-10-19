export class Paginator {
  currentPage: number;
  pageSize: number;
  totalItems: number;

  constructor(
    currentPage: number = 1,
    pageSize: number = 10,
    totalItems: number = 0
  ) {
    this.currentPage = currentPage;
    this.pageSize = pageSize;
    this.totalItems = totalItems;
  }
}
