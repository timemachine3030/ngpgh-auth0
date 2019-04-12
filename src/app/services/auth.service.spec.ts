import { TestBed } from '@angular/core/testing';
import {Auth0Callback, Auth0DecodedHash, Auth0ParseHashError, WebAuth} from 'auth0-js';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    window.localStorage.removeItem('auth_token');
    service = TestBed.get(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe(('isAuthenticated'), () => {
    it(`must return false if NO auth token in the session`, () => {
      expect(service.isAuthenticated()).toBeFalsy();
    });

    it(`must return true if auth token in the session`, () => {
      window.localStorage.setItem('auth_token', 'some token string');
      expect(service.isAuthenticated()).toBeTruthy();
    });
  });

  describe('decodeAuthHash', () => {
    it('resolves a decoded hash', async () => {
      spyOn(WebAuth.prototype, 'parseHash')
        .and.callFake((cb: Auth0Callback<Auth0DecodedHash | null, Auth0ParseHashError>) => {
          return cb(null, {accessToken: 'some token'});
        });
      const decoded: Auth0DecodedHash | null = await service.decodeAuthHash();
      expect(decoded.accessToken).toBe('some token');
    });
    it('rejects any errors', async () => {
      spyOn(WebAuth.prototype, 'parseHash')
        .and.callFake((cb: Auth0Callback<Auth0DecodedHash | null, Auth0ParseHashError>) => {
          return cb({error: 'problem', errorDescription: 'a big problem'}, null);
        });
      try {
        await service.decodeAuthHash();
      } catch (msg) {
        expect(msg.error).toBe('problem');
        return;
      }
      throw new Error('Promise should not be resolved');
    });
  });
});
