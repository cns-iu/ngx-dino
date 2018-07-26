import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { DatatableComponent } from './datatable.component';

@NgModule({
  imports: [MatTableModule],
  declarations: [DatatableComponent],
  exports: [DatatableComponent]
})
export class DatatableModule { }
