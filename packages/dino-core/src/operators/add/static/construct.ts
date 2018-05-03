import { Operator as OperatorClass } from '../../operator';
import {
  TypeConstructor, constructCallback
} from '../internal/construct-callback';
import './map';

function staticConstruct<In, Out>(
  type: TypeConstructor<Out, In>
): OperatorClass<In, Out> {
  return OperatorClass.map<In, Out>(constructCallback, type);
}


// Export onto Operator
declare module '../../operator' {
  namespace Operator {
    let construct: typeof staticConstruct;
  }
}

OperatorClass.construct = staticConstruct;
