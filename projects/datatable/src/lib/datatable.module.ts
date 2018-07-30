import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { DatatableComponent } from './datatable.component';

@NgModule({
  imports: [CommonModule, MatTableModule],
  declarations: [DatatableComponent],
  exports: [DatatableComponent]
})
export class DatatableModule { }
