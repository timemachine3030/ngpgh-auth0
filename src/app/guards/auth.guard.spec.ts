import { TestBed, inject } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthService} from '../services/auth.service';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let auth: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard],
      imports: [RouterTestingModule]
    });

    auth = TestBed.get(AuthService);
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));

  describe('canActivate', () => {
    it('should return true for a logged in user', inject([AuthGuard], (guard: AuthGuard) => {
      spyOn(auth, 'isAuthenticated').and.returnValue(true);
      expect(guard.canActivate()).toEqual(true);
    }));

    it('should return false for a non-logged in user', inject([AuthGuard], (guard: AuthGuard) => {
      spyOn(auth, 'isAuthenticated').and.returnValue(false);
      expect(guard.canActivate()).toEqual(false);
    }));
  });
});
