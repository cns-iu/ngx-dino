import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DinoScienceMapModule } from '@ngx-dino/science-map';
import { DinoScienceMapLegendModule } from '@ngx-dino/science-map-legend';

import { ScienceMapComponent } from './science-map/science-map.component';

@NgModule({
  imports: [
    CommonModule,
    DinoScienceMapModule,
    DinoScienceMapLegendModule
  ],
  exports: [
    ScienceMapComponent
  ],
  declarations: [ScienceMapComponent]
})
export class WrapperModule { }
