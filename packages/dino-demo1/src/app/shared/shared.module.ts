import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  imports: [
    CommonModule,
    MatTabsModule
  ],
  exports: [
    BrowserAnimationsModule,
    CommonModule,
    MatTabsModule
  ],
  declarations: []
})
export class SharedModule { }
