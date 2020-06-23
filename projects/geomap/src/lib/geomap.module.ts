import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';

import { CoreModule } from '@ngx-dino/core';
import { NetworkModule } from '@ngx-dino/network';
import { BasemapComponent } from './basemap/basemap.component';
import { GeomapComponent } from './geomap/geomap.component';
import { ZoomSelectorComponent } from './zoom-selector/zoom-selector.component';

@NgModule({
  imports: [CommonModule, CoreModule, MatRadioModule, NetworkModule],
  declarations: [BasemapComponent, GeomapComponent, ZoomSelectorComponent],
  exports: [GeomapComponent]
})
export class GeomapModule { }
