import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiRequestsService } from 'src/app/core/services/api/base-api-requests.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { EquipmentHistoryFiltersInput } from '../models/input/equipment-history-list-input';
import { EquipmentHistoryListOutput } from '../models/output/equipment-history-list-output';

@Injectable({ providedIn: 'root' })
export class EquipmentHistoryService extends BaseApiRequestsService {
  constructor(
    protected session: SessionService,
    protected http: HttpClient
  ) {
    super(session, http);
    this.baseUrl = 'EquipmentHistory/';
  }

  private baseUrl: string;

  getList = async (input: EquipmentHistoryFiltersInput): Promise<EquipmentHistoryListOutput> => await this.post(this.baseUrl + 'list', input);
}
