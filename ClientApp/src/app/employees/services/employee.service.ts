import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiRequestsService } from 'src/app/core/services/api/base-api-requests.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { BaseApiOutput } from 'src/app/core/models/output/base-api-output';
import { EmployeeFiltersInput } from '../models/input/employee-list-input';
import { EmployeeListOutput } from '../models/output/employee-list-output';
import { Employee } from '../models/output/employee';

@Injectable({ providedIn: 'root' })
export class EmployeeService extends BaseApiRequestsService {
  constructor(
    protected session: SessionService,
    protected http: HttpClient
  ) {
    super(session, http);
  }
  baseUrl = 'Employee/';

  getList = async (input: EmployeeFiltersInput): Promise<EmployeeListOutput> => await this.post(this.baseUrl + 'list', input);

  getByDocument = async (cpfCnpj: string): Promise<Employee> => await this.get(this.baseUrl + `get-by-document/${cpfCnpj}`);

  deleteEmployee = async (id: string): Promise<BaseApiOutput> => await this.delete(this.baseUrl + `delete/${id}`);

  upsert = async (input: Employee): Promise<BaseApiOutput> => await this.post(this.baseUrl + 'upsert-employee', input);

}
