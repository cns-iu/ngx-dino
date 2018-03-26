import { Operator as OperatorClass } from '../../operator';


function staticConstruct<In, Out>(
  type: {new (args: In): Out}
): OperatorClass<In, Out> {
  return OperatorClass.map((args) => new type(args));
}


// Export onto Operator
declare module '../../Operator' {
  namespace Operator {
    let construct: typeof staticConstruct;
  }
}

OperatorClass.construct = staticConstruct;
