import { Map } from 'immutable';

import { Operator } from '../operators';
import '../operators/add/static/identity';
import '../operators/add/method/chain';


export enum DataType {
  Any = 'any'
}


type MappingArg<In, Out> = [string, Operator<In, Out> | true][] |
  {[key: string]: Operator<In, Out> | true};

export interface FieldArgs<R> {
  id: string;
  label: string;
  datatype?: DataType;

  initialOp?: Operator<any, any>;
  mapping?: MappingArg<any, R>;
}


export class Field<T> {
  readonly id: string;
  readonly label: string;
  readonly datatype: DataType;

  readonly initialOp: Operator<any, any>;
  readonly mapping: Map<string, BoundField<T>>;

  constructor(args: FieldArgs<T>) {
    ({
      id: this.id,
      label: this.label,
      datatype: this.datatype = DataType.Any,
      initialOp: this.initialOp = Operator.identity()
    } = args);

    this.mapping = Map(Map(args.mapping || {}).map((op: Operator<any, T> | true) => {
      const newOp = op === true ? this.initialOp : this.initialOp.chain(op);
      return new BoundField(this, newOp);
    }));
  }

  getOperator(selector: string): Operator<any, T> {
    const bound = this.getBoundField(selector);
    return bound && bound.operator;
  }

  getBoundField(selector: string): BoundField<T> {
    return this.mapping.get(selector);
  }
}

export class BoundField<T> {
  constructor(readonly field: Field<T>, readonly operator: Operator<any, T>) { }

  get(data: any): T {
    return this.operator.get(data);
  }
}
