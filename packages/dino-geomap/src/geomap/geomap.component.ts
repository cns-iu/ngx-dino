import {
  Component, Input, ViewChild,
  OnInit, AfterViewInit, OnChanges, DoCheck, OnDestroy,
  ElementRef
 } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { defaultLogLevel } from '../shared/log-level';
import { map } from '@ngx-dino/core/src/operators/methods/transforming/map';
import { simpleField, BoundField, RawChangeSet, ChangeSet } from '@ngx-dino/core';
import { vega, makeChangeSet } from '@ngx-dino/vega';
import { State } from '../shared/state';
import { Point } from '../shared/point';
import { lookupStateCode } from '../shared/state-lookup';
import { GeomapDataService } from '../shared/geomap.dataservice';
import * as us10m from '../shared/us-10m.json';
import * as geomapSpec from '../shared/spec.json';


@Component({
  selector: 'dino-geomap',
  templateUrl: './geomap.component.html',
  styleUrls: ['./geomap.component.sass'],
  providers: [GeomapDataService]
})
export class GeomapComponent implements OnInit, AfterViewInit, OnChanges, DoCheck, OnDestroy {
  @Input() width: number;
  @Input() height: number;
  @Input() autoresize = true;

  @Input() stateDataStream: Observable<RawChangeSet>;
  @Input() stateField: BoundField<string>;
  @Input() stateColorField: BoundField<string>;
  @Input() stateDefaultStrokeColor = 'white';
  @Input() stateDefaultColor = '#bebebe';

  @Input() pointDataStream: Observable<RawChangeSet>;
  @Input() pointIdField: BoundField<string>;
  @Input() pointLatLongField: BoundField<[number, number]>;
  @Input() pointSizeField: BoundField<number>;
  @Input() pointColorField: BoundField<string>;
  @Input() pointShapeField: BoundField<string>;
  @Input() strokeColorField: BoundField<string>;
  @Input() pointTitleField: BoundField<string>;

  @ViewChild('mountPoint') mountPoint: ElementRef;

  private stateIdField: BoundField<number>;
  private view: any = null;
  private statesSubscription: Subscription;
  private pointSubscription: Subscription;

  constructor(element: ElementRef, private dataService: GeomapDataService) {
    this.stateIdField = simpleField({
      label: 'State ANSI Id',
      operator: map((data: any): number => {
        const state = this.stateField.get(data);
        return state ? lookupStateCode(state) : -1;
      })
    }).getBoundField();
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.renderView(geomapSpec);
  }

  ngOnChanges(changes) {
    this.updateProcessor(changes);

    const signals = {
      stateDefaultColor: this.stateDefaultColor,
      stateDefaultStrokeColor: this.stateDefaultStrokeColor
    };
    if (!this.autoresize) {
      Object.assign(signals, {width: this.width, height: this.height});
    }
    this.updateSignals(signals);
  }

  ngDoCheck(): void {
    if (this.autoresize && this.mountPoint) {
      const element = this.mountPoint.nativeElement;
      const signals = {
        width: element.clientWidth,
        height: element.clientHeight - 4
      };
      this.updateSignals(signals);
    }
  }

  ngOnDestroy() {
    this.finalizeView();
  }

  updateProcessor(changes): void {
    let updateFields = true;
    for (const name in changes) {
      if (name.endsWith('Stream')) {
        this.dataService.fetchData(
          this.pointDataStream,
          this.stateDataStream,
          this.strokeColorField,
          this.stateField,
          this.stateColorField,
          this.stateIdField,
          this.pointIdField,
          this.pointLatLongField,
          this.pointSizeField,
          this.pointColorField,
          this.pointShapeField,
          this.pointTitleField
        );
        updateFields = false;
        break;
      }
    }

    if (updateFields) {
      for (const name in changes) {
        if (name.endsWith('Field')) {
          this.dataService.update(
            this.strokeColorField,
            this.stateField,
            this.stateColorField,
            this.stateIdField,
            this.pointIdField,
            this.pointLatLongField,
            this.pointSizeField,
            this.pointColorField,
            this.pointShapeField,
            this.pointTitleField
          );
          break;
        }
      }
    }
  }

  private renderView(spec: any) {
    this.finalizeView(); // Remove any old view

    this.view = new vega.View(vega.parse(spec))
      .renderer('svg')
      .initialize(this.mountPoint.nativeElement)
      .logLevel(defaultLogLevel)
      .hover()
      .insert('states', vega.read(us10m, {
        type: 'topojson',
        feature: 'states'
      })).signal('stateDefaultColor', this.stateDefaultColor)
      .run();

    this.statesSubscription = this.dataService.states.subscribe((change: ChangeSet<State>) => {
      this.view.change('stateColorCoding', makeChangeSet<State>(change, 'id')).run();
    });

    this.pointSubscription = this.dataService.points.subscribe((change: ChangeSet<Point>) => {
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


  private updateSignals(signals: {[name: string]: any}): void {
    if (this.view) {
      let rerun = false;
      // tslint:disable:forin
      for (const name in signals) {
        const oldValue = this.view.signal(name);
        const newValue = signals[name];
        if (newValue !== oldValue) {
          this.view.signal(name, newValue);
          rerun = true;
        }
      }

      if (rerun) {
        this.view.run();
      }
    }
  }
}
