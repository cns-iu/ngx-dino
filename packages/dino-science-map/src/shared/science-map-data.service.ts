import { Injectable } from '@angular/core';

import * as d3Collection from 'd3-collection';
import * as d3Array from 'd3-array';

import { Operator } from '@ngx-dino/core';

import * as underlyingScimapData from './underlyingScimapData.json';

@Injectable()
export class ScienceMapDataService {
  underlyingScimapData: any;
  subdIdToPosition: any;
  subdIdToDisc: any;
  subdIdToName: any;
  discIdToColor: any;

  constructor() {
    this.underlyingScimapData = underlyingScimapData;
    this.makeMappings();
    }

  makeMappings() {
    this.subdIdToPosition = underlyingScimapData.nodes.reduce((map, n) => {
      map[n.subd_id] = {x: n.x, y: n.y};
      return map;
    }, {});

    this.subdIdToDisc = underlyingScimapData.nodes.reduce((map, n) => {
      map[n.subd_id] = {disc_id: n.disc_id};
      return map;
    }, {});

    this.subdIdToName = underlyingScimapData.nodes.reduce((map, n) => {
      map[n.subd_id] = {subd_name: n.subd_name};
      return map;
    }, {});

    this.discIdToColor = underlyingScimapData.disciplines.reduce((map, d) => {
      map[d.disc_id] = d.color;
      return map;
    }, {});
  }
}
