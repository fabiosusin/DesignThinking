import { BaseApiOutput } from 'src/app/core/models/output/base-api-output';
import { Employee } from './employee';

export class EmployeeListOutput extends BaseApiOutput {
  employees?: Employee[];
}