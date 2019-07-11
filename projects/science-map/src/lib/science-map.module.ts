import { NgModule } from '@angular/core';
import { CoreModule } from '@ngx-dino/core';

import { ScienceMapComponent } from './science-map.component';

@NgModule({
  imports: [CoreModule],
  declarations: [ScienceMapComponent],
  exports: [ScienceMapComponent]
})
export class ScienceMapModule { }
