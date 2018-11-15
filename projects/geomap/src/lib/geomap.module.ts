import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '@ngx-dino/core';
import { NetworkModule } from '@ngx-dino/network';
import { BasemapComponent } from './basemap/basemap.component';
import { GeomapComponent } from './geomap/geomap.component';

@NgModule({
  imports: [CommonModule, CoreModule, NetworkModule],
  declarations: [BasemapComponent, GeomapComponent],
  exports: [GeomapComponent]
})
export class GeomapModule { }
