import { TestBed } from '@angular/core/testing';

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

});
