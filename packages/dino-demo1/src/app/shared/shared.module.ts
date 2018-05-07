import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    
    MatTabsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule
  ],
  exports: [
    BrowserAnimationsModule,
    CommonModule,

    MatTabsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule
  ],
  declarations: []
})
export class SharedModule { }
