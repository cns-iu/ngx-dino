import { NgModule } from '@angular/core';
import { EdgeComponent } from './edge/edge.component';
import { NetworkComponent } from './network/network.component';
import { NodeComponent } from './node/node.component';

@NgModule({
  imports: [],
  declarations: [EdgeComponent, NetworkComponent, NodeComponent],
  exports: [NetworkComponent]
})
export class NetworkModule { }
