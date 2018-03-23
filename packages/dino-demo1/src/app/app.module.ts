import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { DinoForceNetworkModule } from '@ngx-dino/force-network';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // DinoScatterplotModule
    DinoForceNetworkModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
