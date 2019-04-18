import { Injectable } from '@angular/core';
import {CanActivate, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service';

type GuardResult = Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService
  ) { }

  canActivate(): GuardResult {
    const authenticated = this.auth.isAuthenticated();
    if (!authenticated) {
      this.auth.login();
    }
    return authenticated;
  }
}
