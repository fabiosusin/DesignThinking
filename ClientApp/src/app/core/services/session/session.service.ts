import { Injectable } from '@angular/core';
import { LocalStorageKeys } from '../../models/enum/local-storage-keys';
import { SessionData, TokenInfo, UserData } from '../../models/output/session-output';
import { SideMenuNode } from '../../models/side-menu';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({ providedIn: 'root' })
export class SessionService {
  static get isDevMode(): boolean {
    return LocalStorageService.getFromStorage(LocalStorageKeys.devMode) === 'true';
  }

  clearSession = () => LocalStorageService.clearSession();

  setSideMenu = (data: SideMenuNode[]) => data ? LocalStorageService.setToStorage(LocalStorageKeys.sideMenu, JSON.stringify(data)) : {};

  setSession = (data: SessionData) => data ? LocalStorageService.setToStorage(LocalStorageKeys.sessionData, JSON.stringify(data)) : {};

  setTokenInfo = (data: TokenInfo) => {
    if (!data)
      return;

    const session = this.getSession();
    session.token = data;
    this.setSession(session);
  }

  getTokenInfo = (): TokenInfo | undefined => this.getSession()?.token;

  getLoggedUser = (): UserData | undefined => this.getSession()?.user;

  getLoggedUserEmail = (): string | undefined => this.getSession()?.user?.email;

  getSession = (): SessionData => LocalStorageService.getFromStorage(LocalStorageKeys.sessionData) ? JSON.parse(LocalStorageService.getFromStorage(LocalStorageKeys.sessionData)) : null;

  getSideMenu = (): SideMenuNode[] => LocalStorageService.getFromStorage(LocalStorageKeys.sideMenu) ? JSON.parse(LocalStorageService.getFromStorage(LocalStorageKeys.sideMenu)) : null;
}