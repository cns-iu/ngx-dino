import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataProcessorService } from '@ngx-dino/core';

import { DinoScienceMapModule } from '@ngx-dino/science-map';
import { DinoForceNetworkModule } from '@ngx-dino/force-network';
import { DinoGeomapModule } from '@ngx-dino/geomap';
import { DinoScatterplotModule } from '@ngx-dino/scatterplot';
import { DinoDatatableModule } from '@ngx-dino/datatable';

import { DinoLegendModule } from '@ngx-dino/legend';

import { SharedModule } from '../shared';

import { ScienceMapComponent } from './science-map/science-map.component';
import { ForceNetworkComponent } from './force-network/force-network.component';
import { GeomapComponent } from './geomap/geomap.component';
import { ScatterplotComponent } from './scatterplot/scatterplot.component';
import { ScienceMapLegendComponent } from './science-map-legend/science-map-legend.component';
import { ForceNetworkLegendComponent } from './force-network-legend/force-network-legend.component';
import { DatatableComponent } from './datatable/datatable.component';

@NgModule({
  imports: [
    CommonModule,

    DinoScienceMapModule,
    DinoForceNetworkModule,
    DinoGeomapModule,
    DinoScatterplotModule,
    DinoDatatableModule,

    DinoLegendModule,

    SharedModule
  ],
  exports: [
    ScienceMapComponent,
    ForceNetworkComponent,
    ScatterplotComponent,
    GeomapComponent,
    DatatableComponent,

    ScienceMapLegendComponent,
    ForceNetworkLegendComponent
  ],
  declarations: [
    ScienceMapComponent,
    ForceNetworkComponent,
    GeomapComponent,
    ScatterplotComponent,
    DatatableComponent,

    ScienceMapLegendComponent,
    ForceNetworkLegendComponent,
  ],
  providers: [DataProcessorService]
})
export class WrapperModule { }
