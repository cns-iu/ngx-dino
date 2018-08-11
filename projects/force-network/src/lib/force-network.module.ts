import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@ngx-dino/core';
import { ForceNetworkComponent } from './force-network.component';

@NgModule({
  imports: [CommonModule, CoreModule],
  exports: [ForceNetworkComponent],
  declarations: [ForceNetworkComponent]
})
export class ForceNetworkModule { }
