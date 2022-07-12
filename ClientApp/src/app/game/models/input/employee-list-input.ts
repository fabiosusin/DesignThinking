import { PaginatorInput } from "src/app/core/models/input/paginator-input";
import { GameFilters } from "./employee-filters-input";

export class GameFiltersInput {
  constructor() {
    this.filters = new GameFilters();
  }

  filters: GameFilters;
  paginator?: PaginatorInput;
}
