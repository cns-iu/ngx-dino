import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

import { ColorLegendComponent } from './color-legend/color-legend.component';
import { NodeSizeLegendComponent } from './node-size-legend/node-size-legend.component';
import { EdgeSizeLegendComponent } from './edge-size-legend/edge-size-legend.component';
import { StartLegendComponent } from './start-legend/start-legend.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule
  ],
  declarations: [
    ColorLegendComponent,
    NodeSizeLegendComponent,
    EdgeSizeLegendComponent,
    StartLegendComponent
  ],
  exports: [
    ColorLegendComponent,
    NodeSizeLegendComponent,
    EdgeSizeLegendComponent,
    StartLegendComponent
  ]
})
export class LegendModule { }
