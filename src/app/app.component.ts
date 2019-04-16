import { Component } from '@angular/core';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    public auth: AuthService,
  ) {

  }
  title = 'ngpgh';

  public login() {
    this.auth.login();
  }

  public logout() {
    this.auth.logout();
  }
}
