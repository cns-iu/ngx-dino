import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeomapComponent } from './geomap.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [GeomapComponent],
  declarations: [GeomapComponent]
})
export class GeomapModule { }
