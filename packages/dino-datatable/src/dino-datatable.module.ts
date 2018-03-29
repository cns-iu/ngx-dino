import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

import { DatatableComponent } from './datatable/datatable.component';
import { DatatableService } from './shared/datatable.service';


@NgModule({
  imports: [
    CommonModule,
    MatTableModule
  ],
  exports: [
    DatatableComponent
  ],
  declarations: [
    DatatableComponent
  ],
  providers: [
    DatatableService
  ]
})
export class DinoDatatableModule { }
