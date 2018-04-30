import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DinoScienceMapModule } from '@ngx-dino/science-map';
import { DinoForceNetworkModule } from '@ngx-dino/force-network';
import { DinoGeomapModule } from '@ngx-dino/geomap';
import { DinoScatterplotModule } from '@ngx-dino/scatterplot';

import { SharedModule } from '../shared';

import { ScienceMapComponent } from './science-map/science-map.component';
import { ForceNetworkComponent } from './force-network/force-network.component';
import { GeomapComponent } from './geomap/geomap.component';
import { ScatterplotComponent } from './scatterplot/scatterplot.component';

@NgModule({
  imports: [
    CommonModule,
    DinoScienceMapModule,
    DinoForceNetworkModule,
    DinoGeomapModule,
    DinoScatterplotModule,
    
    SharedModule
  ],
  exports: [
    ScienceMapComponent,
    ForceNetworkComponent,
    ScatterplotComponent,
    GeomapComponent
  ],
  declarations: [
    ScienceMapComponent,
    ForceNetworkComponent,
    GeomapComponent,
    ScatterplotComponent
  ]
})
export class WrapperModule { }
