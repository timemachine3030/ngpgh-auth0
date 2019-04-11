import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UnrestrictedComponent } from './views/unrestricted/unrestricted.component';
import { PrivateComponent } from './views/private/private.component';
import { CallbackComponent } from './views/callback/callback.component';

@NgModule({
  declarations: [
    AppComponent,
    UnrestrictedComponent,
    PrivateComponent,
    CallbackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
