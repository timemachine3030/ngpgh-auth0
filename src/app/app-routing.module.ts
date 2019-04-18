import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from './guards/auth.guard';
import {AuthComponent} from './views/auth/auth.component';
import {PrivateComponent} from './views/private/private.component';

const routes: Routes = [
  {
    path: 'callback',
    component: AuthComponent,
  },
  {
    path: 'profile',
    component: PrivateComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
