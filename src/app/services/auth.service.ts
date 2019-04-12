import { Injectable } from '@angular/core';
import {Auth0DecodedHash, Auth0ParseHashError, WebAuth} from 'auth0-js';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth0: WebAuth;

  constructor() {
    this.auth0 = new WebAuth({
      clientID: environment.auth.clientID,
      domain: environment.auth.domain,
      responseType: 'token',
      redirectUri: environment.auth.redirect,
      audience: environment.auth.audience,
      scope: environment.auth.scope
    });
  }

  public isAuthenticated(): boolean {
    return !!window.localStorage.getItem('auth_token');
  }

  public decodeAuthHash(): Promise<Auth0DecodedHash | null> {
    return new Promise(((resolve, reject) => {
      return this.auth0.parseHash((err: Auth0ParseHashError, decoded: Auth0DecodedHash | null) => {
        if (err) {
         return reject(err);
        }
        return resolve(decoded);
      });
    }));
  }
}
