import { NgModule } from '@angular/core';
import { CoreComponent } from './core.component';
import { AutoResizeDirective } from './directives/auto-resize/auto-resize.directive';

@NgModule({
  imports: [],
  declarations: [CoreComponent, AutoResizeDirective],
  exports: [CoreComponent, AutoResizeDirective]
})
export class CoreModule { }
