import { NgModule } from '@angular/core';

import { AutoResizeDirective } from './directives/auto-resize/auto-resize.directive';

@NgModule({
  imports: [],
  declarations: [AutoResizeDirective],
  exports: [AutoResizeDirective]
})
export class CoreModule { }
