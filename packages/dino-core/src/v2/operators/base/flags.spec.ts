/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />

import { Flags } from './flags';


describe('operators', () => {
describe('base', () => {
describe('Flags', () => {
  it('should have enum like class instances', () => {
    expect(Flags.Cachable).toBeDefined();
    expect(Flags.InputIndependent).toBeDefined();
    expect(Flags.None).toBeDefined();
    expect(Flags.All).toBeDefined();
  });

  // TODO
});
});
});
