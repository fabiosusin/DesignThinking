import { BaseApiOutput } from 'src/app/core/models/output/base-api-output';
import { Loan } from './loan';

export class LoanListOutput extends BaseApiOutput {
  loans?: Loan[];
}