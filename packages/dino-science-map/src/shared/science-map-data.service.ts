import { Injectable } from '@angular/core';

import * as d3Collection from 'd3-collection';
import * as d3Array from 'd3-array';

import { Operator } from '@ngx-dino/core';
import * as discLookup from './disc_lookup.json';
import * as data from './data.json'; // TODO data to be replaced with actual data
import * as mappingJournal from './journalMapping.json';

@Injectable()
export class ScienceMapDataService {
  nestedData: any;
  filteredData = data;
  

  constructor() {
    // this.scaleOperator('linear'); 
    // Operator.map(this.scaleOperator); // .get(item)

    this.preprocessData();
    this.nestedData = this.nestDiscChildData(this.nestDiscData(this.filteredData.records.data));
  }

  // scaleOperator(scaleType: any) {  
  // }

  preprocessData() {
    let foundCount = 0;
    let notFoundCount = 0;
    const newData = [];
    this.filteredData.records.data.forEach((d) => {
    var match = [];
    if (d.journal) {
      match = mappingJournal.records.data.filter((d1) => d1.formal_name.toLowerCase() === d.journal.toLowerCase())
    }

    match.forEach((d1) => {
      var authors = [];
      d.author_ids.forEach((d2) => {
        authors.push(data.authors.data.find(function(d4, i4) {
          return d4.id === d2;
        }).author)
      })
      const newDataObj: any = new Object(d);
      newDataObj.subd_id = d1.subd_id;
      newDataObj.author_list = authors.join('; ');
      newDataObj.url = d1.url;
      newData.push(newDataObj);
    });

    if (match.length > 0) {
      foundCount++;
    } else {
      notFoundCount++;
      }
    })
    this.filteredData.records.data = newData;
  }
  
  nestDiscChildData(data: any) { // TODO can be improvised
    data.disc.forEach((d) => {
      d.value.nestedChildren = d3Collection.nest()
          .key((d1: any): any => Number.parseInt(d1.subd_id))
          .rollup((leaves): any => { const obj = { children: leaves };
            this.filteredData.records.schema.forEach((d1) => {
              if (d1.type === 'numeric') {
                obj[d1.name] = d3Array.sum(leaves, (d2) => d2[d1.name])
              }
            })
            return obj;
          }).entries(d.value.children);
      data.sub_disc = data.sub_disc.concat(d.value.nestedChildren);
    });
    return data;
  }

  nestDiscData(data: any) {
    data.forEach((d) => { // TODO can be improvised
      const disc = discLookup.records.data.filter((d1) => d.subd_id === d1.subd_id)
      d.disc_id = disc[0].disc_id;
    });
    
    return {
        disc: d3Collection.nest()
          .key((d: any): any => Number.parseInt(d.disc_id))
          .rollup((leaves): any => { const obj = { children: leaves };
              this.filteredData.records.schema.forEach(function(d) {
                if (d.type === 'numeric') {
                  obj[d.name] = d3Array.sum(leaves, function(d1) {
                    return d1[d.name];
                  })
                }
              })
            return obj;
          })
          .entries(data),
          sub_disc: []
    };
  }
}
