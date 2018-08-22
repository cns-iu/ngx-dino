import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { Map } from 'immutable';

import { 
  BoundField,
  CachedChangeStream,
  DataProcessor, 
  Datum, 
  ChangeSet, 
  DataProcessorService, 
  RawChangeSet 
} from '@ngx-dino/core';

@Injectable()
export class LegendDataService {
  public edgeSizeProcessor: DataProcessor<any, any>;
  private edgeChange = new BehaviorSubject<ChangeSet<any>>(new ChangeSet<any>());
  public edges: Observable<ChangeSet<any>> = this.edgeChange.asObservable();

  private edgeStreamSubscription: Subscription;

  constructor(private processorService: DataProcessorService) { }

  fetchData(
    edgeStream: Observable<RawChangeSet<any>>,
    edgeIdField: BoundField<string>,
    edgeSizeField: BoundField<number>
  ): this {
    if (edgeStream && edgeIdField && edgeSizeField) {
      this.edgeSizeProcessor = this.processorService.createProcessor<Datum<any>, any>(
        edgeStream, 
        edgeIdField,
        {
          id: edgeIdField,
          [edgeSizeField.id]: edgeSizeField
        }
      );

      if (this.edgeStreamSubscription) {
        this.edgeStreamSubscription.unsubscribe();
      }

      this.edgeStreamSubscription = this.edgeSizeProcessor.asObservable().subscribe(
        (change) => this.edgeChange.next(change));

      return this;
    }
  }


  updateData(changedField: BoundField<number | string>) {
    const fieldName = changedField.id;
    if(this.edgeSizeProcessor) {
      this.edgeSizeProcessor.updateFields(Map({
        [fieldName]: changedField
      })); 
    }
  }
}
