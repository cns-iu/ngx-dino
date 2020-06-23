import { Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Map as ImmutableMap } from 'immutable';
import { get, isFunction, isNil, some } from 'lodash';
import { Observable, Subscription } from 'rxjs';

import {
  BoundField, DatumId, DataProcessor, DataProcessorService, RawChangeSet, idSymbol
} from '@ngx-dino/core';
import { createDefaultField } from '../shared/default-fields';
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
  @Input() barLabelMaxLength: number;

  @ViewChild('tooltipElement', { static: true }) tooltipElement: ElementRef;
  @ViewChild('textSizeTest', { static: true }) textSizeTestElement: ElementRef;
  readonly testText = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ,.';

  layout = new Layout();
  margins = { left: 0, right: 0, top: 0, bottom: 0 };

  get xscale(): number { return 1 - this.margins.left - this.margins.right; }
  get yscale(): number { return .97 - this.margins.top - this.margins.bottom; }
  get xoffset(): number { return this.margins.left; }
  get yoffset(): number { return this.margins.top; }

  private barProcessor: DataProcessor<any, any>;
  private barSubscription: Subscription;

  private width = 0;
  private height = 0;

  constructor(
    private processorService: DataProcessorService,
    private sanitizer: DomSanitizer
  ) { }

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
    this.setDefault('barLabelMaxLength', 10);

    if ('barStream' in changes || 'barIdField' in changes) {
      this.reset();
      this.updateMargins(this.width, this.height);
      return;
    }

    if ('barSpacing' in changes) {
      this.layout.setBarSpacing(this.barSpacing);
    }

    if ('barLabelMaxLength' in changes) {
      this.updateMargins(this.width, this.height);
    }

    if (this.detectFieldChange(changes) || this.detectDefaultChange(changes)) {
      this.updateProcessor();
      this.updateMargins(this.width, this.height);
    }
  }

  ngOnDestroy(): void { this.cleanup(); }
  onResize(width: number, height: number): void {
    this.width = width;
    this.height = height;

    this.layout.setHeight(height);
    this.updateMargins(width, height);
  }

  getMarksTransform(): SafeStyle {
    const { xscale, xoffset } = this;
    return this.scaleAndTranslate(xscale, 1, xoffset, 0);
  }

  getBarsTransform(): SafeStyle {
    const { xscale, yscale, xoffset, yoffset } = this;
    return this.scaleAndTranslate(xscale, yscale, xoffset, yoffset);
  }

  private setDefault<K extends keyof this>(key: K, value: this[K]): void {
    if (isNil(this[key])) {
      this[key] = value;
    }
  }

  private scaleAndTranslate(sx: number, sy: number, dx: number, dy: number): SafeStyle {
    const scale = `scale(${sx},${sy})`;
    const translate = `translate(${100 * dx}%,${100 * dy}%)`;
    return this.sanitizer.bypassSecurityTrustStyle(scale + ' ' + translate);
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
      barStackOrderField = barStartField,
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

  private updateProcessor(): void {
    const fields = ImmutableMap<any, any>(this.getBarFields());
    this.barProcessor.updateFields(fields.toKeyedSeq());
  }

  private updateMargins(width: number, height: number): void {
    const { barLabelField, barLabelPositionField, defaultBarLabel, defaultBarLabelPosition } = this;
    const el: SVGTextElement = get(this, ['textSizeTestElement', 'nativeElement']);
    const hasLabels = barLabelField || defaultBarLabel;
    const hasTestElement = el && isFunction(el.getBBox);

    if (hasLabels && hasTestElement) {
      const { width: textWidth, height: textHeight } = el.getBBox();
      const textLength = this.testText.length;
      const cwidth = textWidth / textLength / width;
      const cheight = textHeight / height;
      const labelPosition = barLabelPositionField ? 'unknown' : defaultBarLabelPosition;
      this.updateMarginsFor(labelPosition, cwidth, cheight);
    } else {
      this.updateMarginsFor('center', 0, 0);
    }
  }

  private updateMarginsFor(position: LabelPosition | 'unknown', cwidth: number, cheight: number): void {
    const { barLabelMaxLength: maxLength } = this;
    let left = 0, right = 0, top = cheight, bottom = 0;
    switch (position) {
      case 'left':
        left = maxLength * cwidth;
        break;

      case 'right':
        right = maxLength * cwidth;
        break;

      case 'bottom':
        bottom = cheight;
        break;

      case 'unknown':
        left = maxLength * cwidth;
        right = maxLength * cwidth;
        top = cheight;
        bottom = cheight;
        break;

      case 'top': /* fallthrough */
      case 'center':
        break; // Do nothing
    }

    this.margins = { left, right, top, bottom };
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
    if (this.barSubscription) { this.barSubscription.unsubscribe(); }
  }
}
