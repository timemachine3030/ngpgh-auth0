import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {AuthService} from './services/auth.service';

describe('AppComponent', () => {
  let auth: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        AuthService
      ],
    }).compileComponents();

    auth = TestBed.get(AuthService);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ngpgh'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('ngpgh');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Angular + Auth0!');
  });

  it('must hide the logout button if not logged in', () => {
    spyOn(auth, 'isAuthenticated').and.returnValue(false);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.private-buttons').hidden).toBeTruthy();
    expect(compiled.querySelector('.btn.login').hidden).toBeFalsy();
  });

  it('must hide the login button is logged in', () => {
    spyOn(auth, 'isAuthenticated').and.returnValue(true);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.private-buttons').hidden).toBeFalsy();
    expect(compiled.querySelector('.btn.login').hidden).toBeTruthy();
  });

});
