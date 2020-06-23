import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map as RxJSMap } from 'rxjs/operators';
import { Set, Map } from 'immutable';
import { uniqBy, isNumber, sortBy } from 'lodash';

import { BoundField, DataProcessor, Datum, DatumId, ChangeSet,
  idSymbol, DataProcessorService, RawChangeSet, chain, map, simpleField } from '@ngx-dino/core';


export class DataItem<T = string | number, R = string | number> extends Datum<any> {
  value: T;
  input: R;
  label: string;
  order: number;
}

export interface SummaryStatistics {
  min: DataItem;
  max: DataItem;
  median: DataItem;
}

export function validField(field: BoundField<any>): BoundField<any> {
  if (field) {
    // tslint:disable-next-line: deprecation
    const wrapped = field.operator.wrapped;
    // Test for !ConstantOperator(undefined | null)
    if (!('value' in wrapped) || wrapped['value'] != null) {
      return field;
    }
  }
  return undefined;
}

export function valueLabelField(valueField: BoundField<string | number>) {
  return simpleField({
    label: valueField.label + ' Label',
    operator: chain(valueField.operator, map((o) => {
      if (isNumber(o)) {
        return Math.round(o).toLocaleString();
      } else {
        return o;
      }
    }))
  }).getBoundField();
}

@Injectable()
export class SummaryDataService {
  private dataItemsChange = new BehaviorSubject<DataItem[]>([]);
  readonly dataItems = this.dataItemsChange.asObservable();

  private subscriptions: Subscription[] = [];
  private dataProcessor: DataProcessor<any, any>;

  constructor(private dataProcessorService: DataProcessorService) {}

  observeStatistics(): Observable<SummaryStatistics> {
    return this.dataItems.pipe(RxJSMap(this.computeSummaryStatistics, this));
  }
  observeUniqueItems(): Observable<DataItem[]> {
    return this.dataItems.pipe(RxJSMap(this.uniqueDataItems, this));
  }

  clearProcessor(): void {
    this.cleanup();
  }

  createProcessor(stream: Observable<RawChangeSet>,
        idField: BoundField<DatumId>,
        valueField: BoundField<string | number>,
        inputField?: BoundField<string | number>,
        labelField?: BoundField<string>,
        orderField?: BoundField<number>
      ) {

    this.cleanup();
    const processor = this.dataProcessorService.createProcessor(stream, idField,
      this.getFieldMapping(valueField, inputField, labelField, orderField));

    let rawData = [];
    const subscription = processor.asObservable().subscribe((set) => {
      rawData = this.applyChangeSet<DataItem>(set, rawData);
      const data = sortBy(rawData, 'order');
      this.dataItemsChange.next(data);
    });

    this.dataProcessor = processor;
    this.subscriptions.push(subscription);
  }

  updateProcessor(valueField: BoundField<string | number>, inputField?: BoundField<string | number>,
      labelField?: BoundField<string>, orderField?: BoundField<number>): void {
    const fields = Map<any, any>(this.getFieldMapping(valueField, inputField, labelField, orderField));
    this.dataProcessor.updateFields(fields.toKeyedSeq());
  }

  getFieldMapping(valueField: BoundField<string | number>, inputField?: BoundField<string | number>,
      labelField?: BoundField<string>, orderField?: BoundField<number>): { [type: string]: BoundField<any> } {

    // If the fields provided are not valid, this sets them to undefined. Then when mapping
    // below, it can easily setup the logic for what replaces an undefined bound field.
    inputField = validField(inputField);
    labelField = validField(labelField);
    orderField = validField(orderField);

    return {
      value: valueField,
      input: inputField || valueField,
      label: labelField || inputField || valueLabelField(valueField),
      order: orderField || inputField || valueField
    };
  }

  private computeSummaryStatistics(data: DataItem[]): SummaryStatistics {
    const min = data.length > 0 ? data[0] : undefined;
    const max = data.length > 0 ? data.slice(-1)[0] : undefined;
    const median = data.length > 0 ? data[Math.floor((data.length - 1) / 2)] : undefined;

    return {min, max, median};
  }
  private uniqueDataItems(data: DataItem[]): DataItem[] {
    return uniqBy(data, 'input');
  }

  private applyChangeSet<T extends Datum>(set: ChangeSet<any>, data: T[]): T[] {
    const removeIds = set.remove.map(rem => rem[idSymbol]);
    const replaceIds = set.replace.map(rep => rep[idSymbol]);
    const filteredIds = Set<DatumId>().merge(removeIds, replaceIds);
    const filtered = data.filter(item => !filteredIds.has(item[idSymbol]));
    const appliedData = filtered.concat(set.insert.toArray() as T[], set.replace.toArray() as T[]);
    const uniqueData = uniqBy(appliedData.reverse(), idSymbol).reverse();
    return uniqueData;
  }

  private cleanup() {
    this.dataItemsChange.next([]);
    this.subscriptions.forEach(s => s.unsubscribe());
    this.subscriptions = [];
  }
}
