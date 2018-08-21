import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EdgeComponent } from './edge/edge.component';
import { NetworkComponent } from './network/network.component';
import { NodeComponent } from './node/node.component';

@NgModule({
  imports: [CommonModule],
  declarations: [EdgeComponent, NetworkComponent, NodeComponent],
  exports: [NetworkComponent]
})
export class NetworkModule { }
