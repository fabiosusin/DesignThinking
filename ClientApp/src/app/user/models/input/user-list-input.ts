import { PaginatorInput } from "src/app/core/models/input/paginator-input";
import { UserFilters } from "./user-filters-input";

export class UserFiltersInput {
  filters?: UserFilters;
  paginator?: PaginatorInput;
}