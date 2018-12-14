import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Map } from 'immutable';
import { some } from 'lodash';
import { Observable, Subscription } from 'rxjs';

import {
  BoundField, DatumId, DataProcessor, DataProcessorService, RawChangeSet, idSymbol
} from '@ngx-dino/core';
import * as defaultFields from '../shared/default-fields';
import { Layout } from '../shared/layout';
import { LabelPosition } from '../shared/types';

@Component({
  selector: 'dino-temporal-bargraph',
  templateUrl: './temporal-bargraph.component.html',
  styleUrls: ['./temporal-bargraph.component.css']
})
export class TemporalBargraphComponent implements OnChanges, OnDestroy {
  @Input() barStream: Observable<RawChangeSet>;
  @Input() barIdField: BoundField<DatumId>;
  @Input() barStartField: BoundField<any>;
  @Input() barEndField: BoundField<any>;
  @Input() barWeightField: BoundField<number>;
  @Input() barStackOrderField: BoundField<number>;
  @Input() barColorField: BoundField<string>;
  @Input() barTransparencyField: BoundField<number>;
  @Input() barStrokeColorField: BoundField<string>;
  @Input() barStrokeWidthField: BoundField<number>;
  @Input() barStrokeTransparencyField: BoundField<number>;
  @Input() barLabelField: BoundField<string>;
  @Input() barLabelPositionField: BoundField<LabelPosition>;

  @Input() barSpacing: number;

  layout = new Layout();

  private barProcessor: DataProcessor<any, any>;
  private barSubscription: Subscription;

  constructor(private processorService: DataProcessorService) { console.log(this); }

  ngOnChanges(changes: SimpleChanges): void {
    if ('barStream' in changes || 'barIdField' in changes) {
      this.reset();
      return;
    }

    if ('barSpacing' in changes) {
      this.layout.setBarSpacing(this.barSpacing);
    }

    if (some(changes, (_value, key) => /^bar\w+Field$/.test(key))) {
      this.updateProcessor();
    }
  }

  ngOnDestroy(): void { this.cleanup(); }
  onResize(_width: number, height: number): void { this.layout.setHeight(height); }

  private getBarFields(): any {
    const {
      defaultWeightField, defaultStackOrderField,
      defaultColorField, defaultTransparencyField,
      defaultStrokeColorField, defaultStrokeWidthField,
      defaultStrokeTransparencyField,
      defaultLabelField, defaultLabelPositionField
    } = defaultFields;
    const {
      barStartField, barEndField,
      barWeightField = defaultWeightField, barStackOrderField = defaultStackOrderField,
      barColorField = defaultColorField, barTransparencyField = defaultTransparencyField,
      barStrokeColorField = defaultStrokeColorField, barStrokeWidthField = defaultStrokeWidthField,
      barStrokeTransparencyField = defaultStrokeTransparencyField,
      barLabelField = defaultLabelField, barLabelPositionField = defaultLabelPositionField
    } = this;

    if (!barStartField || !barEndField) {
      return { };
    }

    return {
      start: barStartField,
      end: barEndField,
      weight: barWeightField,
      stackOrder: barStackOrderField,

      color: barColorField,
      transparency: barTransparencyField,
      strokeColor: barStrokeColorField,
      strokeWidth: barStrokeWidthField,
      strokeTransparency: barStrokeTransparencyField,

      label: barLabelField,
      labelPosition: barLabelPositionField
    };
  }

  private createProcessor(): void {
    const { barStream, barIdField, processorService } = this;
    if (!barStream || !barIdField) {
      return;
    }

    const processor = processorService.createProcessor(barStream, barIdField, this.getBarFields());
    const subscription = processor.asObservable().subscribe((set) => {
      const insert = set.insert.toArray();
      const remove = set.remove.map(item => item[idSymbol]).toArray();
      const replace = set.replace.map(item => [item[idSymbol], item]).toArray();
      this.layout.addItems(insert as any[]);
      this.layout.removeItems(remove);
      this.layout.replaceItems(replace as any[]);
    });

    this.barProcessor = processor;
    this.barSubscription = subscription;
  }

  updateProcessor(): void {
    const fields = Map<any, any>(this.getBarFields());
    this.barProcessor.updateFields(fields.toKeyedSeq());
  }

  private reset(): void {
    this.cleanup();
    this.layout = new Layout()
      .setHeight(this.layout.height)
      .setBarSpacing(this.barSpacing);
    this.createProcessor();
  }

  private cleanup(): void {
    this.barProcessor = undefined;
    if (this.barSubscription) {
      this.barSubscription.unsubscribe();
    }
  }
}
