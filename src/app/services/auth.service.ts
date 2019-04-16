import { Injectable } from '@angular/core';
import {Auth0DecodedHash, Auth0ParseHashError, Auth0UserProfile, WebAuth} from 'auth0-js';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public auth0: WebAuth;
  public expiresAt: Date;
  public profile: Auth0UserProfile;

  private authToken: string;

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
    this.loadSession();
    try {
      const expired = Date.now() > this.expiresAt.getTime();
      return this.authToken && !expired;
    } catch (err) {
      return false;
    }
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

  /**
   * Use access token to retrieve user's profile from auth0 and set session
   */
  public getUserProfile(authResult: Auth0DecodedHash): Promise<Auth0UserProfile> {
    return new Promise((resolve, reject) => {
      this.auth0.client.userInfo(authResult.accessToken, (err: any, profile: Auth0UserProfile) => {
        if (err) {
          return reject(err);
        }
        this.setSession(authResult, profile);
        return resolve(profile);
      });
    });
  }

  /**
   * Populate instance properties from LocalStorage;
   */
  private loadSession() {
    this.authToken = window.localStorage.getItem('auth_token');
    this.profile = JSON.parse(window.localStorage.getItem('profile'));
    const expireStr = window.localStorage.getItem('expires_at');
    if (expireStr) {
      const expireInt =  parseInt(expireStr, 10);
      this.expiresAt = new Date(expireInt);
    } else {
      // in no item in storage, always expired
      this.expiresAt = new Date(0);
    }
  }
  /**
   * Update the local storage information for the current login session.
   */
  private setSession(authResult: Auth0DecodedHash, profile: Auth0UserProfile): void {
    // Set the time that the Access Token will expire at
    const expiresInt = (authResult.expiresIn * 1000) + new Date().getTime();
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('expires_at', JSON.stringify(expiresInt));
    localStorage.setItem('profile', JSON.stringify(profile));

    // Load into the current instance
    this.loadSession();
  }
}
