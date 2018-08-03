import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataProcessorService } from '@ngx-dino/core';

import { ScienceMapModule } from '@ngx-dino/science-map';
import { ForceNetworkModule } from '@ngx-dino/force-network';
import { GeomapModule } from '@ngx-dino/geomap';
import { ScatterplotModule } from '@ngx-dino/scatterplot';
import { DatatableModule } from '@ngx-dino/datatable';

import { LegendModule } from '@ngx-dino/legend';

import { SharedModule } from '../shared';

import { ScienceMapComponent } from './science-map/science-map.component';
import { ForceNetworkComponent } from './force-network/force-network.component';
import { GeomapComponent } from './geomap/geomap.component';
import { ScatterplotComponent } from './scatterplot/scatterplot.component';
import { ScienceMapLegendComponent } from './science-map-legend/science-map-legend.component';
import { ForceNetworkLegendComponent } from './force-network-legend/force-network-legend.component';
import { DatatableComponent } from './datatable/datatable.component';
import { ScatterplotLegendComponent } from './scatterplot-legend/scatterplot-legend.component';
import { GeomapLegendComponent } from './geomap-legend/geomap-legend.component';

@NgModule({
  imports: [
    CommonModule,

    ScienceMapModule,
    ForceNetworkModule,
    GeomapModule,
    ScatterplotModule,
    DatatableModule,

    LegendModule,

    SharedModule
  ],
  exports: [
    ScienceMapComponent,
    ForceNetworkComponent,
    ScatterplotComponent,
    GeomapComponent,
    DatatableComponent,

    ScienceMapLegendComponent,
    ForceNetworkLegendComponent,
    ScatterplotLegendComponent,
    GeomapLegendComponent
  ],
  declarations: [
    ScienceMapComponent,
    ForceNetworkComponent,
    GeomapComponent,
    ScatterplotComponent,
    DatatableComponent,

    ScienceMapLegendComponent,
    ForceNetworkLegendComponent,
    ScatterplotLegendComponent,
    GeomapLegendComponent
  ],
  providers: [DataProcessorService]
})
export class WrapperModule { }
