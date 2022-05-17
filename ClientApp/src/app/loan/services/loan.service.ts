import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiRequestsService } from 'src/app/core/services/api/base-api-requests.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { BaseApiOutput } from 'src/app/core/models/output/base-api-output';
import { LoanFiltersInput } from '../models/input/loan-list-input';
import { Loan } from '../models/output/loan';
import { LoanListOutputData } from '../models/output/loan-list-output-data';
import { LoanDetails, LoanDetailsOutput } from '../models/output/loan-details-output';
import { UpserLoanOutput } from 'src/app/core/models/output/upsert-loan-output';

@Injectable({ providedIn: 'root' })
export class LoanService extends BaseApiRequestsService {
  constructor(
    protected session: SessionService,
    protected http: HttpClient
  ) {
    super(session, http);
  }
  private baseUrl = 'Loan/';

  getList = async (input: LoanFiltersInput): Promise<LoanListOutputData> => await this.post(this.baseUrl + 'list', input);

  equipmentDevolution = async (input: LoanDetails): Promise<UpserLoanOutput> => await this.post(`${this.baseUrl}equipment-devolution`, input);

  getLoanDetails = async (id: string): Promise<LoanDetailsOutput> => await this.get(`${this.baseUrl}get-loan/${id}`);

  upsertLoan = async (input: Loan): Promise<UpserLoanOutput> => await this.post(this.baseUrl + 'upsert-loan', input);
}
