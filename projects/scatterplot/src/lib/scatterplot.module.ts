import { NgModule } from '@angular/core';
import { CoreModule } from '@ngx-dino/core';
import { ScatterplotComponent } from './scatterplot.component';

@NgModule({
  imports: [CoreModule],
  declarations: [ScatterplotComponent],
  exports: [ScatterplotComponent]
})
export class ScatterplotModule { }
