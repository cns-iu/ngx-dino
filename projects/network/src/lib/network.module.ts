import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@ngx-dino/core';
import { EdgeComponent } from './edge/edge.component';
import { NetworkComponent } from './network/network.component';
import { NodeComponent } from './node/node.component';

@NgModule({
  imports: [CommonModule, CoreModule],
  declarations: [EdgeComponent, NetworkComponent, NodeComponent],
  exports: [EdgeComponent, NetworkComponent, NodeComponent]
})
export class NetworkModule { }
