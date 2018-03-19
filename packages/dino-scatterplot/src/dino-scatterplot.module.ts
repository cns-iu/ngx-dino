import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScatterplotComponent } from './scatterplot/scatterplot.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    ScatterplotComponent
  ],
  declarations: [ScatterplotComponent]
})
export class DinoScatterplotModule { }
