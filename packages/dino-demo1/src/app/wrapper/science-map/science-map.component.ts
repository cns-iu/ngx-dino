import { Component, OnInit, Input } from '@angular/core';
import { BoundField } from '@ngx-dino/core'

import {
  subdisciplineSizeField,
  subdisciplineIDField,

  tooltipTextField
} from '../shared/science-map/science-map-fields';
import { ScienceMapDataService } from '../shared/science-map/science-map-data.service';

@Component({
  selector: 'app-science-map',
  templateUrl: './science-map.component.html',
  styleUrls: ['./science-map.component.sass'],
  providers:[ScienceMapDataService]
})
export class ScienceMapComponent implements OnInit {
  @Input() height = window.innerHeight;
  @Input() width = window.innerWidth - 30;
  
  subdisciplineSize: BoundField<number>;
  subdisciplineID: BoundField<number|string>;

  filteredSubdisciplines: any[];
  
  nodeSizeRange = [2, 18]; 
  margin = { top: 0, bottom: 0, left: 0, right: 0 };
  minPositionX = 0; // viewbox min-x position in pixels
  minPositionY = -15; // viewbox min-y position in pixels
  
  enableTooltip = true;
  
  constructor(private dataService: ScienceMapDataService) { }

  ngOnInit() {
    // not user facing
    this.subdisciplineSize = subdisciplineSizeField.getBoundField();
    this.subdisciplineID = subdisciplineIDField.getBoundField();

    this.filteredSubdisciplines = this.dataService.filteredSubdisciplines.data;
  }

  log(event: any) {
    console.log('output event from science-map on target - ', event);
  }
}
