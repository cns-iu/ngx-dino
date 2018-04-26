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
  subdisciplineSize: BoundField<string>;
  subdisciplineID: BoundField<number|string>;
  filteredSubdisciplines: any[];
  width = window.innerWidth;
  height = window.innerHeight;
  nodeSizeRange = [2, 18];

  constructor(private dataService: ScienceMapDataService) { }

  ngOnInit() {
    // not user facing
    this.subdisciplineSize = subdisciplineSizeField.getBoundField('size');
    this.subdisciplineID = subdisciplineIDField.getBoundField('id');
    
    this.filteredSubdisciplines = this.dataService.filteredSubdisciplines.data;
  }

}
