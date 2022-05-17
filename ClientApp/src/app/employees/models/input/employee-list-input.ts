import { PaginatorInput } from "src/app/core/models/input/paginator-input";
import { EmployeeFilters } from "./employee-filters-input";

export class EmployeeFiltersInput {
  constructor() {
    this.filters = new EmployeeFilters();
  }

  filters: EmployeeFilters;
  paginator?: PaginatorInput;
}