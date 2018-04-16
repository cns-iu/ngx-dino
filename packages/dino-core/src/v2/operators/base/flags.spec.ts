/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />

import { Flags } from './flags';


describe('operators', () => {
describe('base', () => {
describe('Flags', () => {
  it('should have enum like class instances', () => {
    expect(Flags.Stateless).toBeDefined();
    expect(Flags.InputIndependent).toBeDefined();
    expect(Flags.SideEffectFree).toBeDefined();

    expect(Flags.None).toBeDefined();
    expect(Flags.All).toBeDefined();
  });

  it('should test for inclusion', () => {
    expect(Flags.All.has(Flags.Stateless)).toBeTruthy();
    expect(Flags.All.all(Flags.Stateless)).toBeTruthy();
    expect(Flags.All.any(Flags.Stateless)).toBeTruthy();
  });

  it('should test for exclusion', () => {
    expect(Flags.None.has(Flags.Stateless)).toBeFalsy();
    expect(Flags.None.all(Flags.Stateless)).toBeFalsy();
    expect(Flags.None.any(Flags.Stateless)).toBeFalsy();
  });

  it('should be not-able', () => {
    expect(Flags.None.not()).toEqual(jasmine.any(Flags));
    expect(Flags.None.not().has(Flags.All)).toBeTruthy();
  });

  it('should be or-able', () => {
    const flag = Flags.Stateless.or(Flags.InputIndependent);

    expect(flag).toEqual(jasmine.any(Flags));
    expect(flag.all(Flags.Stateless, Flags.InputIndependent)).toBeTruthy();
  });

  it('should be and-able', () => {
    const flag = Flags.All.and(Flags.Stateless);

    expect(flag).toEqual(jasmine.any(Flags));
    expect(flag.has(Flags.Stateless)).toBeTruthy();
  });

  it('should be xor-able', () => {
    const flag = Flags.All.xor(Flags.Stateless);

    expect(flag).toEqual(jasmine.any(Flags));
    expect(flag.has(Flags.Stateless)).toBeFalsy();
  });

  it('should equal if it contains the same flags', () => {
    expect(Flags.All.equals(Flags.All)).toBeTruthy();
  });

  it('should not equal if it contains at least one differing flag', () => {
    expect(Flags.All.equals(Flags.Stateless)).toBeFalsy();
  });
});
});
});
