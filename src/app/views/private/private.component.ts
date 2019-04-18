import { Component, OnInit } from '@angular/core';
import {Auth0UserProfile} from 'auth0-js';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent implements OnInit {
  public profile: Auth0UserProfile;

  constructor(
    public auth: AuthService
  ) { }

  public ngOnInit() {
    if (this.auth.profile) {
      this.profile = this.auth.profile;
    } else {
      this.auth.login();
    }
  }


}
