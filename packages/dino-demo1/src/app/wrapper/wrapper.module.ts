import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DinoScienceMapModule } from '@ngx-dino/science-map';
import { DinoForceNetworkModule } from '@ngx-dino/force-network';
import { DinoGeomapModule } from '@ngx-dino/geomap';
import { DinoScatterplotModule } from '@ngx-dino/scatterplot';

import { DinoLegendModule } from '@ngx-dino/legend';

import { SharedModule } from '../shared';

import { ScienceMapComponent } from './science-map/science-map.component';
import { ForceNetworkComponent } from './force-network/force-network.component';
import { GeomapComponent } from './geomap/geomap.component';
import { ScatterplotComponent } from './scatterplot/scatterplot.component';
import { ScienceMapLegendComponent } from './science-map-legend/science-map-legend.component';
import { ForceNetworkLegendComponent } from './force-network-legend/force-network-legend.component';

@NgModule({
  imports: [
    CommonModule,

    DinoScienceMapModule,
    DinoForceNetworkModule,
    DinoGeomapModule,
    DinoScatterplotModule,

    DinoLegendModule,
    
    SharedModule
  ],
  exports: [
    ScienceMapComponent,
    ForceNetworkComponent,
    ScatterplotComponent,
    GeomapComponent,

    ScienceMapLegendComponent,
    ForceNetworkLegendComponent
  ],
  declarations: [
    ScienceMapComponent,
    ForceNetworkComponent,
    GeomapComponent,
    ScatterplotComponent,
    
    ScienceMapLegendComponent,
    
    ForceNetworkLegendComponent
  ]
})
export class WrapperModule { }
