import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiRequestsService } from 'src/app/core/services/api/base-api-requests.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { HomeDataOutput } from '../models/output/home-data-output';

@Injectable({ providedIn: 'root' })
export class HomeService extends BaseApiRequestsService {
  constructor(
    protected session: SessionService,
    protected http: HttpClient
  ) {
    super(session, http);
    this.baseUrl = 'Home/'
  }

  protected baseUrl: string;
  getData = async (): Promise<HomeDataOutput> => await this.get(this.baseUrl + 'get-data/');
}