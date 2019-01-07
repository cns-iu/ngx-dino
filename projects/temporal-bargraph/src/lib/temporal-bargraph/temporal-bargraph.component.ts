import { Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { Map } from 'immutable';
import { isNil, some } from 'lodash';
import { Observable, Subscription } from 'rxjs';

import {
  BoundField, DatumId, DataProcessor, DataProcessorService, RawChangeSet, idSymbol
} from '@ngx-dino/core';
import { createDefaultField, defaultStackOrderField } from '../shared/default-fields';
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
  @Input() barTooltipField: BoundField<string>;

  @Input() defaultBarWeight: number;
  @Input() defaultBarColor: string;
  @Input() defaultBarTransparency: number;
  @Input() defaultBarStrokeColor: string;
  @Input() defaultBarStrokeWidth: number;
  @Input() defaultBarStrokeTransparency: number;
  @Input() defaultBarLabel: string;
  @Input() defaultBarLabelPosition: LabelPosition;
  @Input() defaultBarTooltip: string;

  @Input() barSpacing: number;

  @ViewChild('tooltipElement') tooltipElement: HTMLDivElement;
  layout = new Layout();

  private barProcessor: DataProcessor<any, any>;
  private barSubscription: Subscription;

  constructor(private processorService: DataProcessorService) { }

  ngOnChanges(changes: SimpleChanges): void {
    // Set defaults
    this.setDefault('defaultBarWeight', 20);
    this.setDefault('defaultBarColor', 'black');
    this.setDefault('defaultBarTransparency', 0);
    this.setDefault('defaultBarStrokeColor', 'black');
    this.setDefault('defaultBarStrokeWidth', 0);
    this.setDefault('defaultBarStrokeTransparency', 0);
    this.setDefault('defaultBarLabel', '');
    this.setDefault('defaultBarLabelPosition', 'center');
    this.setDefault('defaultBarTooltip', '');
    this.setDefault('barSpacing', 0);

    if ('barStream' in changes || 'barIdField' in changes) {
      this.reset();
      return;
    }

    if ('barSpacing' in changes) {
      this.layout.setBarSpacing(this.barSpacing);
    }

    if (this.detectFieldChange(changes) || this.detectDefaultChange(changes)) {
      this.updateProcessor();
    }
  }

  ngOnDestroy(): void { this.cleanup(); }
  onResize(_width: number, height: number): void { this.layout.setHeight(height); }

  private setDefault<K extends keyof this>(key: K, value: this[K]): void {
    if (isNil(this[key])) {
      this[key] = value;
    }
  }

  private detectFieldChange(changes: SimpleChanges): boolean {
    return some(changes, (_value, key) => /^bar\w+Field$/.test(key));
  }

  private detectDefaultChange(changes: SimpleChanges): boolean {
    return some(changes, (_value, key) => {
      const match = /^defaultBar(\w)(\w*)$/.exec(key);
      const fieldKey = match && `bar${match[1].toUpperCase()}${match[2]}Field`;
      return fieldKey && fieldKey in changes;
    });
  }

  private getBarFields(): any {
    const {
      barStartField, barEndField,
      barWeightField = createDefaultField(this.defaultBarWeight),
      barStackOrderField = defaultStackOrderField,
      barColorField = createDefaultField(this.defaultBarColor),
      barTransparencyField = createDefaultField(this.defaultBarTransparency),
      barStrokeColorField = createDefaultField(this.defaultBarStrokeColor),
      barStrokeWidthField = createDefaultField(this.defaultBarStrokeWidth),
      barStrokeTransparencyField = createDefaultField(this.defaultBarStrokeTransparency),
      barLabelField = createDefaultField(this.defaultBarLabel),
      barLabelPositionField = createDefaultField(this.defaultBarLabelPosition),
      barTooltipField = createDefaultField(this.defaultBarTooltip)
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
      labelPosition: barLabelPositionField,

      tooltip: barTooltipField
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
