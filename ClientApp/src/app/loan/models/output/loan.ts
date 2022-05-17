import { BaseDataOutput } from "src/app/core/models/output/base-data-output";

export class Loan extends BaseDataOutput {
  userId?: string;
  employeeId?: string;
  employeeName?: string;
  loanDate?: Date;

  returned?: boolean;
  devolutionDate?: Date;

  equipmentsIds?: String[];
}
