import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiOutput } from 'src/app/core/models/output/base-api-output';
import { BaseApiRequestsService } from 'src/app/core/services/api/base-api-requests.service';
import { SessionService } from 'src/app/core/services/session/session.service';

@Injectable({ providedIn: 'root' })
export class LoginService extends BaseApiRequestsService {
  constructor(
    protected session: SessionService,
    protected http: HttpClient
  ) {
    super(session, http);
    this.baseUrl = 'User/'
  }

  protected baseUrl: string;
  sendTempPassword = async (userEmail: string): Promise<BaseApiOutput> => await this.post(this.baseUrl + 'send-temp-password/' + userEmail);
}