import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { RawChangeSet, Datum, idSymbol } from '@ngx-dino/core';

import { ScatterplotDataService } from '../shared/scatterplot/scatterplot-data.service';
import {
  pointIdField,
  sizeField,
  colorField,
  colorCategoryField
} from '../shared/scatterplot/scatterplot-fields';

@Component({
  selector: 'app-scatterplot-legend',
  templateUrl: './scatterplot-legend.component.html',
  styleUrls: ['./scatterplot-legend.component.sass'],
  providers: [ScatterplotDataService]
})
export class ScatterplotLegendComponent implements OnInit {
  nodeStream: Observable<RawChangeSet<any>>;

  nodes = [];

  nodeIdField = pointIdField.getBoundField();
  nodeSizeField = sizeField.getBoundField();
  nodeColorField = colorField.getBoundField();
  colorCategoryField = colorCategoryField.getBoundField();

  nodeSizeRange = [8, 14];
  nodeShape = 'Node';

  constructor(private dataService: ScatterplotDataService) {
    this.nodeStream = this.dataService.data;

    this.dataService.data.subscribe((nodes: any) => {
      this.nodes = this.nodes.filter((e: any) => !nodes.remove
      .some((obj: Datum<any>) => obj[idSymbol] === e.id)).concat(nodes.insert);

      nodes.update.forEach((el) => {
        const index = this.nodes.findIndex((e) => e.id === el[1].id);
        this.nodeStream[index] = Object.assign(this.nodeStream[index] || {}, <any>el[1]);
      });
    });
   }

  ngOnInit() {
  }

}
