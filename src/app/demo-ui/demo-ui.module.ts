import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared';
import { WrapperModule } from '../wrapper';

import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WrapperModule
  ],
  exports: [
    HomeComponent
  ],
  declarations: [HomeComponent]
})
export class DemoUiModule { }
