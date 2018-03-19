import { ElementRef, Component, Input, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { defaultLogLevel } from '../shared/log-level';
import { Changes, IField, Field, FieldProcessor, StreamCache } from '@ngx-dino/core';
import { vega, makeChangeSet } from '@ngx-dino/vega';
import { State } from '../shared/state';
import { Point } from '../shared/point';
import { lookupStateCode } from '../shared/state-lookup';
import { GeomapDataService } from '../shared/geomap.dataservice';

const us10m: any = require('../shared/us-10m.json');
const geomapSpec: any = require('../shared/spec.json');

@Component({
  selector: 'dino-geomap',
  templateUrl: './geomap.component.html',
  styleUrls: ['./geomap.component.sass'],
  providers: [GeomapDataService]
})

export class GeomapComponent implements OnInit, OnDestroy, OnChanges {
  @Input() stateDataStream: Observable<Changes>;
  @Input() stateField: IField<string>;
  @Input() stateColorField: IField<string>;

  @Input() pointDataStream: Observable<Changes>;
  @Input() pointIdField: IField<string>;
  @Input() pointLatLongField: IField<[number, number]>;
  @Input() pointSizeField: IField<number>;
  @Input() pointColorField: IField<string>;
  @Input() pointShapeField: IField<string>;

  private stateIdField: IField<number>;
  private nativeElement: any;
  private view: any = null;
  private statesSubscription: Subscription;
  private pointSubscription: Subscription;
  private pointStreamCache: StreamCache<any>;
  private stateStreamCache: StreamCache<any>;

  constructor(element: ElementRef, private dataService: GeomapDataService) {
    this.nativeElement = element.nativeElement;
    this.stateIdField = new Field({
      name: 'id', label: 'State ANSI Id', datatype: 'number',
      accessor: (data: any): number => {
        const state = this.stateField.get(data);
        return state ? lookupStateCode(state) : -1;
      }
    });
  }

  ngOnInit() {
    this.renderView(geomapSpec);
  }

  ngOnChanges(changes) {
    for (const propName in changes) {
      if (propName.endsWith('Stream') && this[propName]) {
        this.stateStreamCache = new StreamCache<any>(this.stateIdField, this.stateDataStream);
        this.pointStreamCache = new StreamCache<any>(this.pointIdField, this.pointDataStream);
        this.updateStreamProcessor();
      } else if (propName.endsWith('Field') && this[propName]) {
        if (propName.startsWith('point')) {
          this.updateStreamProcessor('point');
        } else {
          this.updateStreamProcessor('state');
        }
      }
    }
  }

  ngOnDestroy() {
    this.finalizeView();
  }

  updateStreamProcessor(update: string = null) {
    if (this.pointStreamCache
      && this.stateStreamCache
      && this.stateColorField
      && this.pointColorField
      && this.pointShapeField
      && this.pointSizeField) {
        this.dataService.fetchData(
        this.pointStreamCache.asObservable(),
        this.stateStreamCache.asObservable(),
        this.stateField,
        this.stateColorField,
        this.stateIdField,
        this.pointIdField,
        this.pointLatLongField,
        this.pointSizeField,
        this.pointColorField,
        this.pointShapeField
      );
    }
    if (this.pointStreamCache && this.stateStreamCache && update) {
      if (update === 'point') {
        this.pointStreamCache.sendUpdate();
      } else {
        this.stateStreamCache.sendUpdate();
      }
    }
  }

  private renderView(spec: any) {
    this.finalizeView(); // Remove any old view

    this.view = new vega.View(vega.parse(spec))
      .renderer('svg')
      .initialize(this.nativeElement)
      .logLevel(defaultLogLevel)
      .hover()
      .insert('states', vega.read(us10m, {
        type: 'topojson',
        feature: 'states'
      })).run();

    this.statesSubscription = this.dataService.states.subscribe((change: Changes<State>) => {
      this.view.change('stateColorCoding', makeChangeSet<State>(change, 'id')).run();
    });

    this.pointSubscription = this.dataService.points.subscribe((change: Changes<Point>) => {
      this.view.change('points', makeChangeSet<Point>(change, 'id')).run();
    });
  }

  private finalizeView() {
    if (this.statesSubscription) {
      this.statesSubscription.unsubscribe();
    }
    if (this.pointSubscription) {
      this.pointSubscription.unsubscribe();
    }
    if (this.view) {
      this.view.finalize();
    }
  }
}
