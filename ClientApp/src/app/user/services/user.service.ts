import { Md5 } from 'ts-md5';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiOutput } from 'src/app/core/models/output/base-api-output';
import { BaseApiRequestsService } from 'src/app/core/services/api/base-api-requests.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { AddUserInput } from '../models/input/add-user-input';
import { UserFiltersInput } from '../models/input/user-list-input';
import { UserListOutput } from '../models/output/user-list-output';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseApiRequestsService {
  constructor(
    protected session: SessionService,
    protected http: HttpClient
  ) {
    super(session, http);
    this.baseUrl = 'User/';
  }

  private baseUrl: string;

  getList = async (input: UserFiltersInput): Promise<UserListOutput> => await this.post(this.baseUrl + 'list', input);

  deleteUser = async (id: string): Promise<BaseApiOutput> => await this.delete(this.baseUrl + 'delete/' + id);

  upsert = async (data: AddUserInput): Promise<BaseApiOutput> => {
    let input = new AddUserInput({});
    input = { ...data };
    
    if (input.password) {
      input.password = Md5.hashStr(data.password ?? '');
      input.passwordValidation = Md5.hashStr(data.passwordValidation ?? '');
    }
    return await this.post(this.baseUrl + 'upsert-user', input);
  }
}