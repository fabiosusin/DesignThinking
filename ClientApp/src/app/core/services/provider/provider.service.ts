import { SessionService } from './../session/session.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { BaseApiRequestsService } from '../api/base-api-requests.service';
import { SideMenuNode } from '../../models/side-menu';
import { MenuService } from '../menu/menu.service';

@Injectable({ providedIn: 'root' })
export class ProviderService {
  constructor(
    public activatedRoute: ActivatedRoute,
    public toast: ToastService,
    public sessionService: SessionService,
    public baseService: BaseApiRequestsService,
    public route: Router,
    private menuService: MenuService
  ) { }

  getSideMenu = async (): Promise<SideMenuNode[]> => {
    let sessionMenu = this.sessionService.getSideMenu();
    if (sessionMenu)
      return sessionMenu;

    const allyId = '';
    sessionMenu = await this.menuService.getMenu(allyId);
    this.sessionService.setSideMenu(sessionMenu);

    return sessionMenu;
  }
}