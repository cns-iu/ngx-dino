import {
  Component, Input, ViewChild,
  OnInit, AfterViewInit, OnChanges, DoCheck, OnDestroy,
  ElementRef
 } from '@angular/core';
import { Observable, Subscription  } from 'rxjs';
import { isFunction, throttle } from 'lodash';

import { defaultLogLevel } from './shared/log-level';
import { simpleField, BoundField, RawChangeSet, ChangeSet, map } from '@ngx-dino/core';
import { vega, VegaChangeSet } from '@ngx-dino/vega-util';
import { State } from './shared/state';
import { Point } from './shared/point';
import { lookupStateCode } from './shared/state-lookup';
import { GeomapDataService } from './shared/geomap.dataservice';
import us10m from './shared/us-10m.data';
import geomapSpec from './shared/spec.data';


@Component({
  selector: 'dino-geomap',
  templateUrl: './geomap.component.html',
  styleUrls: ['./geomap.component.css'],
  providers: [GeomapDataService]
})
export class GeomapComponent implements OnInit, AfterViewInit, OnChanges, DoCheck, OnDestroy {
  @Input() width: number;
  @Input() height: number;
  @Input() widthDiffThreshold = 0;
  @Input() heightDiffThreshold = 0;
  @Input() autoresize = true;
  @Input() showCounties = false;
  @Input() mapDisplayLevel = 'us';

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
  @Input() pointPulseField: BoundField<boolean>;

  @ViewChild('mountPoint') mountPoint: ElementRef;

  private stateIdField: BoundField<number>;
  private view: any = null;
  private statesSubscription: Subscription;
  private pointSubscription: Subscription;

  constructor(element: ElementRef, private dataService: GeomapDataService) {
    this.stateIdField = simpleField<number>({
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

    if ('showCounties' in changes && this.view) {
      const change = vega.changeset()
        .remove((d) => true)
        .insert(vega.read(us10m, {
          type: 'topojson',
          feature: this.showCounties ? 'counties' : 'states'
        }));
      this.view.change('geoJson', change).run();
    }

    const signals = {
      defaultRegionColor: this.stateDefaultColor,
      defaultRegionStrokeColor: this.stateDefaultStrokeColor
    };

    if ('mapDisplayLevel' in changes && this.view) {
      Object.assign(signals, {selectedRegion: this.getMapDisplayLevelId()});
    }

    if (!this.autoresize) {
      Object.assign(signals, {width: this.width, height: this.height});
    }

    this.updateSignals(signals);
  }

  ngDoCheck(): void {
    if (this.autoresize && this.mountPoint) {
      const element = this.mountPoint.nativeElement;
      const rect = element.getBoundingClientRect();
      const signals = {
        width: this.makeExtentCalc(rect.width, this.widthDiffThreshold),
        height: this.makeExtentCalc(
          Math.max(0, rect.height - 10),
          this.heightDiffThreshold
        )
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
          this.pointTitleField,
          this.pointPulseField
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
            this.pointTitleField,
            this.pointPulseField
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
      .insert('geoJson', vega.read(us10m, {
        type: 'topojson',
        feature: this.showCounties ? 'counties' : 'states'
      }))
      .signal('selectedRegion', this.getMapDisplayLevelId())
      .signal('defaultRegionColor', this.stateDefaultColor)
      .signal('defaultRegionStrokeColor', this.stateDefaultStrokeColor)
      .run();

    this.statesSubscription = this.dataService.states
      .subscribe((change: ChangeSet<State>) => {
        const set = VegaChangeSet.fromDinoChangeSet(change);
        this.view.change('regionColors', set).run();
      });

    this.pointSubscription = this.dataService.points
      .subscribe((change: ChangeSet<Point>) => {
        const set = VegaChangeSet.fromDinoChangeSet(change);
        this.view.change('points', set).run();
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


  // tslint:disable-next-line:member-ordering
  private updateSignals = throttle(function (signals: {[name: string]: any}): void {
    if (this.view) {
      let rerun = false;
      // tslint:disable:forin
      for (const name in signals) {
        const oldValue = this.view.signal(name);
        let newValue = signals[name];
        if (isFunction(newValue)) {
          newValue = newValue(oldValue);
        }
        if (newValue !== oldValue) {
          this.view.signal(name, newValue);
          rerun = true;
        }
      }
      // tslint:enable:forin

      if (rerun) {
        this.view.run();
      }
    }
  }, 200);

  private getMapDisplayLevelId(): string | null {
    const stateCode = lookupStateCode(this.mapDisplayLevel);
    if (stateCode !== -1) {
      return String(stateCode);
    } else if (this.mapDisplayLevel.toLowerCase() === 'us') {
      return null;
    } else {
      return null;
    }
  }

  private makeExtentCalc(
    newValue: number, threshold: number
  ): (oldValue: number) => number {
    return (oldValue) => {
      const diff = newValue - oldValue;
      return 0 < diff && diff < threshold ? oldValue : newValue;
    };
  }
}
