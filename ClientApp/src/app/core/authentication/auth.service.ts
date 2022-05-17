import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiOutput } from 'src/app/core/models/output/base-api-output';
import { BaseApiRequestsService } from 'src/app/core/services/api/base-api-requests.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { LoginInput } from 'src/app/login/models/input/login-input';
import { Md5 } from 'ts-md5';
import { LoginOutput } from '../models/output/login-output';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseApiRequestsService {
  constructor(
    protected session: SessionService,
    protected http: HttpClient
  ) {
    super(session, http);
    this.baseUrl = 'Auth/'
  }

  protected baseUrl: string;
  protected static MasterCoin = 'bananadaana';

  login = async (data: LoginInput): Promise<LoginOutput> => {
    const input = { ...data };
    if (data)
      input.password = data.password == AuthService.MasterCoin ? data.password : Md5.hashStr(data.password ?? '');

    const result = await this.postAuth(this.baseUrl + 'intra-login', input);
    if (result?.success)
      this.session.setSession({
        user: {
          userId: result.id,
          email: result.email,
          name: result.name,
          isMasterUser: result.isMasterUser
        },
        token: {
          token: result.accessToken,
          tokenExpiration: result.accessTokenExpiration
        }
      })

    return result
  }
}