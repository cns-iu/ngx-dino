import { sum as arraySum } from 'lodash';

import { Operator as OperatorClass } from '../../operator';
import { create } from '../internal/create';
import './constant';
import './combine';
import '../method/map';


function staticSum<In = any>(
  ...ops: (number | OperatorClass<In, number>)[]
): OperatorClass<In, number> {
  switch (ops.length) {
    case 0:
      return OperatorClass.constant(0);

    case 1:
      const op = ops[0];
      return op instanceof OperatorClass ? op : OperatorClass.constant(op);

    default:
      return OperatorClass.combine(ops).map(arraySum);
  }
}


// Export onto Operator
declare module '../../operator' {
  namespace Operator {
    let sum: typeof staticSum;
  }
}

OperatorClass.sum = staticSum;
