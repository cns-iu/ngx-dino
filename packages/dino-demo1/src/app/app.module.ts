import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DemoUiModule } from './demo-ui/demo-ui.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DemoUiModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
