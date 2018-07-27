import { Component, OnInit, Input } from '@angular/core';
import { BoundField, RawChangeSet } from '@ngx-dino/core';

import {
  subdisciplineSizeField,
  subdisciplineIdField,

  tooltipTextField
} from '../shared/science-map/science-map-fields';
import { ScienceMapDataService } from '../shared/science-map/science-map-data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-science-map',
  templateUrl: './science-map.component.html',
  styleUrls: ['./science-map.component.sass'],
  providers: [ScienceMapDataService]
})
export class ScienceMapComponent implements OnInit {
  @Input() height = window.innerHeight;
  @Input() width = window.innerWidth - 30;

  filteredSubdisciplines: Observable<RawChangeSet<any>>;

  subdisciplineSize: BoundField<number>;
  subdisciplineId: BoundField<number|string>;
  tooltipText: BoundField<number|string>;

  nodeSizeRange = [2, 18];

  margin = { top: 0, bottom: 0, left: 0, right: 0 };
  minPositionX = 0; // viewbox min-x position in pixels
  minPositionY = -15; // viewbox min-y position in pixels
  autoresize = true;

  enableTooltip = true;

  constructor(private dataService: ScienceMapDataService) { }

  ngOnInit() {
    // not user facing
    this.subdisciplineSize = subdisciplineSizeField.getBoundField();
    this.subdisciplineId = subdisciplineIdField.getBoundField();
    this.tooltipText = tooltipTextField.getBoundField();

    this.filteredSubdisciplines = this.dataService.filteredSubdisciplines;
  }

  log(event: any) {
    console.log('output event from science-map on target - ', event);
  }
}
