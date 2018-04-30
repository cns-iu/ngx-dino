import { Component, OnInit } from '@angular/core';
import { BoundField } from '@ngx-dino/core'
import { subdisciplineSizeField, subdisciplineIDField } from '../shared/science-map/science-map-fields';
import { ScienceMapDataService } from '../shared/science-map/science-map-data.service';

@Component({
  selector: 'app-science-map',
  templateUrl: './science-map.component.html',
  styleUrls: ['./science-map.component.sass'],
  providers:[ScienceMapDataService]
})
export class ScienceMapComponent implements OnInit {
  subdisciplineSize: BoundField<number>;
  subdisciplineID: BoundField<number|string>;
  filteredSubdisciplines: any[];
  width = window.innerWidth - 30; // not being used as an input rn 
  height = window.innerHeight - 300; // not being used as an input rn
  nodeSizeRange = [2, 18]; 
  margin = { top: 500, bottom: 5, left: 20, right: 20};
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
