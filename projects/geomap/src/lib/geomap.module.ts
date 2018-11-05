import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '@ngx-dino/core';
import { NetworkModule } from '@ngx-dino/network';
import { GeomapComponent } from './geomap.component';
import { BasemapComponent } from './basemap/basemap.component';
import { GeomapV2Component } from './geomap-v2/geomap-v2.component';

@NgModule({
  imports: [CommonModule, CoreModule, NetworkModule],
  exports: [GeomapComponent, GeomapV2Component],
  declarations: [GeomapComponent, BasemapComponent, GeomapV2Component]
})
export class GeomapModule { }
