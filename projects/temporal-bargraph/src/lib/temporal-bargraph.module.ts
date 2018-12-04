import { NgModule } from '@angular/core';

import { CoreModule } from '@ngx-dino/core';
import { NetworkModule } from '@ngx-dino/network';
import { TemporalBargraphComponent } from './temporal-bargraph.component';

@NgModule({
  imports: [CoreModule, NetworkModule],
  declarations: [TemporalBargraphComponent],
  exports: [TemporalBargraphComponent]
})
export class TemporalBargraphModule { }
