import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@ngx-dino/core';
import { GeomapComponent } from './geomap.component';

@NgModule({
  imports: [CommonModule, CoreModule],
  exports: [GeomapComponent],
  declarations: [GeomapComponent]
})
export class GeomapModule { }
