import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { ProviderService } from '../services/provider/provider.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private provider: ProviderService) { }

  async canActivate(): Promise<boolean> {
    if (!this.provider.sessionService.getSession()) {
      this.provider.route.navigateByUrl('/login');
      return false;
    }

    return true;
  }
}