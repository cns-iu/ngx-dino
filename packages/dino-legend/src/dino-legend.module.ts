import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

import { ScienceMapColorLegendComponent } from './science-map-color-legend/science-map-color-legend.component';
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
    ScienceMapColorLegendComponent,
    SizeLegendComponent
  ],
  declarations: [
    ScienceMapColorLegendComponent, 
    SizeLegendComponent
  ]
})
export class DinoLegendModule { }
