import { NgModule } from '@angular/core';
import { CoreComponent } from './core.component';
import { ResizableDirective } from './directives/resizable/resizable.directive';

@NgModule({
  imports: [
  ],
  declarations: [CoreComponent, ResizableDirective],
  exports: [CoreComponent, ResizableDirective]
})
export class CoreModule { }
