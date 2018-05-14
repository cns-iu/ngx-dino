import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BoundField, RawChangeSet } from '@ngx-dino/core';
import { SubdisciplineWeight } from '../shared/science-map/subdiscipline-weight';

import { subdisciplineIdField, subdisciplineSizeField } from '../shared/science-map/science-map-fields';
import { ScienceMapDataService } from '../shared/science-map/science-map-data.service';

@Component({
  selector: 'app-science-map-legend',
  templateUrl: './science-map-legend.component.html',
  styleUrls: ['./science-map-legend.component.sass'],
  providers:[ScienceMapDataService]
})
export class ScienceMapLegendComponent implements OnInit, OnChanges {
  filteredSubdisciplines: Observable<RawChangeSet<any>>;
  subdisciplineSize: BoundField<number>;
  subdisciplineId: BoundField<number | string>;

  nodeSizeEncoding = '# Fractionally Assigned Papers';

  constructor(private dataService: ScienceMapDataService) {
    this.filteredSubdisciplines = dataService.filteredSubdisciplines;
    // this.unmappedSubdisciplines = dataService.unmappedSubdisciplines.asObservable();
 }

  ngOnInit() {
    this.subdisciplineSize = subdisciplineSizeField.getBoundField();
    this.subdisciplineId = subdisciplineIdField.getBoundField();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (('filter' in changes)) {
      console.log('filter changed, action: TODO');
    }
  }
}