import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DinoScienceMapLegendModule } from '@ngx-dino/science-map-legend';

import { ScienceMapComponent } from './science-map/science-map.component';

@NgModule({
  imports: [
    CommonModule,
    DinoScienceMapLegendModule
  ],
  exports: [
    ScienceMapComponent
  ],
  declarations: [ScienceMapComponent]
})
export class DinoScienceMapModule { }
