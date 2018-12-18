import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '@ngx-dino/core';
import { BarComponent } from './bar/bar.component';
import { BarGroupComponent } from './bar-group/bar-group.component';
import { TemporalBargraphComponent } from './temporal-bargraph/temporal-bargraph.component';
import { TickMarksComponent } from './tick-marks/tick-marks.component';

@NgModule({
  imports: [CommonModule, CoreModule],
  declarations: [BarComponent, BarGroupComponent, TemporalBargraphComponent, TickMarksComponent],
  exports: [TemporalBargraphComponent]
})
export class TemporalBargraphModule { }
