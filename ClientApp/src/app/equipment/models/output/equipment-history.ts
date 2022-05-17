import { BaseDataOutput } from "src/app/core/models/output/base-data-output";

export class EquipmentHistory extends BaseDataOutput {
  loanId?: string;
  employeeId?: string;
  equipmentId?: string;
  damageNote?: string;
  devolutionDate?: Date;
}
