import { DocTypeEnum } from './../../models/enum/doc-type-enum';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiRequestsService } from 'src/app/core/services/api/base-api-requests.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { AddressOutput } from '../../models/output/address-output';
import { OpenFileOutput } from '../../models/output/open-file-output';

@Injectable({ providedIn: 'root' })
export class GeneralService extends BaseApiRequestsService {
  constructor(
    protected session: SessionService,
    protected http: HttpClient
  ) {
    super(session, http);
    this.baseUrl = 'General/'
    this.mapLocationBaseUrl = this.baseUrl + 'MapLocation/'
    this.docsBaseUrl = this.baseUrl + 'Files/Doc/'
  }

  protected baseUrl: string;
  protected mapLocationBaseUrl: string;
  protected docsBaseUrl: string;

  getAddress = async (zipCode: string): Promise<AddressOutput> => await this.getWithBaseUrl(this.mapLocationBaseUrl + 'get-address' + GeneralService.generateUrlQuery({ zipCode }));

  generateDoc = async (id: string, type: DocTypeEnum): Promise<OpenFileOutput> => await this.getWithBaseUrl(this.docsBaseUrl + 'generate-doc' + GeneralService.generateUrlQuery({ id, type }));
}