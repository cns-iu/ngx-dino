import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '@ngx-dino/core';
import { TemporalBargraphComponent } from './temporal-bargraph/temporal-bargraph.component';
import { TickMarksComponent } from './tick-marks/tick-marks.component';

@NgModule({
  imports: [CommonModule, CoreModule],
  declarations: [TemporalBargraphComponent, TickMarksComponent],
  exports: [TemporalBargraphComponent]
})
export class TemporalBargraphModule { }
