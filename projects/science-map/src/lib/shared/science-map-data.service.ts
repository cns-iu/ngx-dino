import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject, Subscription } from 'rxjs';

import {
  RawChangeSet, BoundField, DataProcessorService,
  DataProcessor, Datum, ChangeSet
} from '@ngx-dino/core';

import { Subdiscipline } from './subdiscipline';
import underlyingScimapData from './underlyingScimapData';


@Injectable({
  providedIn: 'root'
})
export class ScienceMapDataService {
  public subdisciplineProcessor: DataProcessor<any, Subdiscipline & Datum<any>>;
  private subdisciplineChange = new BehaviorSubject<ChangeSet<Subdiscipline>>(new ChangeSet<Subdiscipline>());
  subdisciplines: Observable<ChangeSet<Subdiscipline>> = this.subdisciplineChange.asObservable();

  private streamSubscription: Subscription;

  underlyingScimapData: any;
  subdIdToPosition: any;
  subdIdToDisc: any;
  subdIdToName: any;
  discIdToColor: any;

  constructor(private processorService: DataProcessorService) {
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

  fetchData(
    stream: Observable<RawChangeSet<any>>,

    subdisciplineIdField: BoundField<number | string>,
    subdisciplineSizeField: BoundField<number | string>,

    tooltipTextField: BoundField<number | string>
  ): this {
    this.subdisciplineProcessor = this.processorService.createProcessor<Subdiscipline & Datum<any>, any>(
      stream,
      subdisciplineIdField,
      {
        size: subdisciplineSizeField,
        tooltipText: tooltipTextField
      }
    );

    if (this.streamSubscription) {
      this.streamSubscription.unsubscribe();
    }

    this.streamSubscription = this.subdisciplineProcessor.asObservable().subscribe(
      (change) => this.subdisciplineChange.next(change));

    return this;
  }

  updateData(
    subdisciplineIdField: BoundField<number | string>,
    subdisciplineSizeField: BoundField<number | string>
  ) {
    this.subdisciplineProcessor.updateFields();
  }
}
