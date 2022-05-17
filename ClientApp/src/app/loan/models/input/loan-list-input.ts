import { PaginatorInput } from "src/app/core/models/input/paginator-input";
import { LoanFilters } from "./loan-filters-input";

export class LoanFiltersInput {
  constructor() {
    this.filters = new LoanFilters();
  }

  filters: LoanFilters;
  paginator?: PaginatorInput;
}