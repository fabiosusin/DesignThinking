import { PaginatorInput } from "src/app/core/models/input/paginator-input";
import { EquipmentFilters } from "./equipment-filters-input";

export class EquipmentFiltersInput {
  filters?: EquipmentFilters;
  paginator?: PaginatorInput;
}