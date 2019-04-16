import { TestBed } from '@angular/core/testing';
import {Auth0Callback, Auth0DecodedHash, Auth0ParseHashError, Auth0UserProfile, WebAuth} from 'auth0-js';
import {environment} from '../../environments/environment';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    window.localStorage.removeItem('auth_token');
    window.localStorage.removeItem('expires_at');
    window.localStorage.removeItem('profile');
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
      const futureTime = Date.now() + 10000; // tn seconds in the future
      window.localStorage.setItem('expires_at', JSON.stringify(futureTime));
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
  describe('getUserProfile', () => {
    it('saves the profile to the session', async () => {
      const testProfile: Auth0UserProfile = {
        created_at: '2018-04-04T17:39:47.337Z',
        updated_at: '2019-04-10T20:12:17.650Z',

        clientID: environment.auth.clientID,
        identities: [{
          user_id: '5ac50de3a33e56128a53aaa',
          provider: 'auth0',
          connection: 'Username-Password-Authentication',
          isSocial: false,
        }],

        name: 'Sam Pull',
        nickname: 'sammy',
        picture: 'http://example.com/image.png',
        sub: 'auth0|5ac50de3a33e56128a53aaa',
        user_id: 'auth0|5ac50de3a33e56128a53aaa',

      };
      spyOn(Object.getPrototypeOf(service.auth0.client), 'userInfo')
        .and.callFake((accessToken: string, cb: Auth0Callback<Auth0UserProfile>) => {
        return cb(null, testProfile);
      });
      try {
        const profile: Auth0UserProfile | null = await service.getUserProfile({
          accessToken: 'the token string',
          expiresIn: 15
        });

        expect(profile.name).toBe('Sam Pull');
        const expectedExpire: Date = new Date();
        expectedExpire.setTime(Date.now() + 15000);
        expect(service.expiresAt).toEqual(expectedExpire, 'Token expires in 15 seconds');
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });
    it('rejects any errors', async () => {

      spyOn(Object.getPrototypeOf(service.auth0.client), 'userInfo')
        .and.callFake((accessToken: string, cb: Auth0Callback<Auth0UserProfile>) => {
          return cb({error: 'invalid_token', errorDescription: 'a big problem'}, null);
        });
      try {
        await service.getUserProfile({
          accessToken: 'some token'
        });
      } catch (msg) {
        expect(msg.error).toBe('invalid_token');
        return;
      }
      throw new Error('Promise should not be resolved');
    });
  });
});
