import { BaseApiOutput } from "src/app/core/models/output/base-api-output";
import { BaseInfoOutput } from "src/app/core/models/output/base-info-output";

export class LoanDetailsOutput extends BaseApiOutput {
  details?: LoanDetails
}

export class LoanDetails {
  id?: string;
  employeeName?: string;
  loanDate?: Date;
  devolutionDate?: Date;
  equipments?: LoanEquipmentDetails[];
}

export class LoanEquipmentDetails extends BaseInfoOutput {
  damageNote?: string
}
