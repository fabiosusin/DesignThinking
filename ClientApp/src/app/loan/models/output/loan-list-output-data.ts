import { BaseApiOutput } from 'src/app/core/models/output/base-api-output';

export class LoanListOutputData extends BaseApiOutput {
  loans?: LoanOutput[];
}

export class LoanOutput {
  id?: string;
  employeeName?: string;
  returned?: boolean;
  equipmentName?: string[]
  loanDate?: Date;
  devolutionDate?: Date;
}
