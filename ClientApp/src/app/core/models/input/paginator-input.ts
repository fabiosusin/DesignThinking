export class PaginatorInput {
  constructor(page: number, results: number) {
    this.page = page;
    this.resultsPerPage = results;
  }
  page?: number;
  resultsPerPage?: number;
}