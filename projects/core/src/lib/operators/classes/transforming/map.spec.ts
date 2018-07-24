import { Flags, Operator, create } from '../../test-util';
import { MapOperator } from './map';


describe('operators', () => {
describe('classes', () => {
describe('transforming', () => {
describe('MapOperator', () => {
  const flags = Flags.combine(Flags.Stateless, Flags.SideEffectFree);
  const args = [1, 2, 'a'];
  let spy: jasmine.Spy;
  let op: Operator<any, any>;
  let rawOp: MapOperator<any, any>;

  beforeEach(() => {
    spy = jasmine.createSpy();
    op = create(MapOperator, flags, spy, ...args);
    rawOp = op.wrapped as MapOperator<any, any>;
  });

  it('should create', () => {
    expect(op.wrapped).toEqual(jasmine.any(MapOperator));
  });

  it('should have a mapper', () => {
    expect(rawOp.mapper).toBe(spy);
  });

  it('should have args', () => {
    expect(rawOp.args).toEqual(args);
  });

  it('should call the mapper', () => {
    op.get(1234);
    expect(spy).toHaveBeenCalledWith(1234, ...args);
  });

  it('should return the result of calling the mapper', () => {
    spy.and.returnValue(4321);
    expect(op.get(1234)).toBe(4321);
  });

  it('should equal if same mapper and arguments', () => {
    const op2 = create(MapOperator, flags, spy, ...args);
    expect(op.equals(op2)).toBeTruthy();
  });

  it('should not be equal if different mappers', () => {
    const op2 = create(MapOperator, flags, () => {}, ...args);
    expect(op.equals(op2)).toBeFalsy();
  });

  it('should not be equal if different arguments', () => {
    const op2 = create(MapOperator, flags, spy, 4, 'q', []);
    expect(op.equals(op2)).toBeFalsy();
  });
});
});
});
});
