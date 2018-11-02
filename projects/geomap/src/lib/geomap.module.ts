import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@ngx-dino/core';
import { GeomapComponent } from './geomap.component';
import { BasemapComponent } from './basemap/basemap.component';
import { GeomapV2Component } from './geomap-v2/geomap-v2.component';

@NgModule({
  imports: [CommonModule, CoreModule],
  exports: [GeomapComponent, GeomapV2Component],
  declarations: [GeomapComponent, BasemapComponent, GeomapV2Component]
})
export class GeomapModule { }
