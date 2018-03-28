import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { WrapperModule } from './wrapper/wrapper.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    WrapperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
