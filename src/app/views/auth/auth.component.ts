import { Component, OnInit } from '@angular/core';
import {Auth0Error} from 'auth0-js';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  private error: Auth0Error;

  constructor(
    public auth: AuthService
  ) { }

  ngOnInit() {
    try {
      this.auth.handleLoginCallback();
    } catch (err) {
      this.error = err;
    }
  }

}
