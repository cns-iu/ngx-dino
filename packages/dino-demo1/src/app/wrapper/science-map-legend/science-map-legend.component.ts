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

import { Map, OrderedMap } from 'immutable';

import { SubdisciplineWeight } from '../shared/science-map/subdiscipline-weight';
import { subdisciplineIdField, subdisciplineSizeField } from '../shared/science-map/science-map-fields';
import { ScienceMapDataService } from '../shared/science-map/science-map-data.service';

@Component({
  selector: 'app-science-map-legend',
  templateUrl: './science-map-legend.component.html',
  styleUrls: ['./science-map-legend.component.sass'],
  providers: [ScienceMapDataService]
})
export class ScienceMapLegendComponent implements OnInit, OnChanges {
  filteredSubdisciplines: Observable<RawChangeSet<any>>;
  subdisciplineSize: BoundField<number>;
  subdisciplineId: BoundField<number | string>;

  nodeLabelToColor: Map<string, string>;

  nodeSizeEncoding = '# Fractionally Assigned Papers';
  nodeColorEncoding = 'Disciplines';
  nodeShape = 'Node';

  constructor(private dataService: ScienceMapDataService) {
    this.filteredSubdisciplines = dataService.filteredSubdisciplines;
  }

  ngOnInit() {
    this.subdisciplineSize = subdisciplineSizeField.getBoundField();
    this.subdisciplineId = subdisciplineIdField.getBoundField();
    this.nodeLabelToColor = OrderedMap([
      ['Health Professionals', '#D36E44'],
      ['Medical Specialties', '#D30706'],
      ['Chemistry', '#0707D2'],
      ['Math & Physics', '#8E1BCE'],
      ['Elec. Eng. & Comp. Sci.', '#D372D2'],
      ['Chem. Mech. & Civil Eng.', '#55D4D2'],
      ['Infectious Diseases', '#8D1B18'],
      ['Biology', '#33820D'],
      ['Biotechnology', '#07D46D'],
      ['Humanities', '#D3D46D'],
      ['Social Sciences', '#D3D406'],
      ['Brain Research', '#D39827'],
      ['Earth Sciences', '#9B180F'],
      ['Multidisciplinary', '#000000'],
      ['Unclassified', '#AAAAAA']
    ]);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (('filter' in changes)) {
      console.log('filter changed, action: TODO');
    }
  }
}