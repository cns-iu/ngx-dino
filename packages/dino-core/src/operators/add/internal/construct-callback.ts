export interface TypeConstructor<T, Args> {
  new (args: Args): T;
}

export function constructCallback<In, Out>(
  args: In, type: TypeConstructor<Out, In>
): Out {
  return new type(args);
}
