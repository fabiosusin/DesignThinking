import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiRequestsService } from 'src/app/core/services/api/base-api-requests.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { SideMenuNode } from '../../models/side-menu';

@Injectable({ providedIn: 'root' })
export class MenuService extends BaseApiRequestsService {
  constructor(
    protected session: SessionService,
    protected http: HttpClient
  ) {
    super(session, http);
    this.baseUrl = 'Menu/'
  }

  protected baseUrl: string;

  getMenu = async (allyId: string): Promise<SideMenuNode[]> => await this.get(this.baseUrl + 'get-menu' + MenuService.generateUrlQuery({ allyId, userId: this.session.getSession().user?.userId }));
}