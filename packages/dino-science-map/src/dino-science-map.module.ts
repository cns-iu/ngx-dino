import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScienceMapComponent } from './science-map/science-map.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    ScienceMapComponent
  ],
  declarations: [ScienceMapComponent]
})
export class DinoScienceMapModule { }
