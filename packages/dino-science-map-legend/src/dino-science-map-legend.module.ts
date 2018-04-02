import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

import { ScienceMapLegendComponent } from './science-map-legend/science-map-legend.component';
import { ColorLegendComponent } from './color-legend/color-legend.component';
import { SizeLegendComponent } from './size-legend/size-legend.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule
  ],
  exports: [
    ScienceMapLegendComponent,
    ColorLegendComponent,
    SizeLegendComponent
  ],
  declarations: [
    ScienceMapLegendComponent, 
    ColorLegendComponent, 
    SizeLegendComponent
  ]
})
export class DinoScienceMapLegendModule { }
