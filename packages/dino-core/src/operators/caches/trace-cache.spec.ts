import { Operator, MockOperator, create } from '../test-util';
import { TraceCache } from './trace-cache';


describe('operators', () => {
describe('caches', () => {
describe('TraceCache', () => {
  let spy: jasmine.Spy;
  let cache: TraceCache;
  let op: Operator<any, any>;

  beforeEach(() => {
    spy = jasmine.createSpy();
    cache = new TraceCache(spy);
    op = create(MockOperator);
  });

  it('should create', () => {
    expect(cache).toEqual(jasmine.any(TraceCache));
  });

  it('should call the trace function', () => {
    cache.get(op, undefined);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should send arguments to the trace function', () => {
    spyOn(op.wrapped as MockOperator, 'getImpl').and.returnValue('bar');
    cache.get(op, 'foo');
    expect(spy.calls.argsFor(0)).toEqual([jasmine.objectContaining({
      operator: op,
      cache: cache,
      level: 0,
      data: 'foo',
      result: 'bar'
    })]);
  });

  it('should allow the trace function to change the result', () => {
    spy.and.callFake((args) => (args.result = 11));
    expect(cache.get(op, 'abc')).toBe(11);
  });

  it('should allow the trace function to suppress errors', () => {
    spyOn(op.wrapped as MockOperator, 'getImpl').and.throwError('qqq');
    spy.and.callFake((args) => (args.result = 12, args.error = undefined));
    expect(cache.get(op, 'def')).toBe(12);
  });

  it('should allow the trace function to change the error', () => {
    spyOn(op.wrapped as MockOperator, 'getImpl').and.throwError('qqq');
    spy.and.callFake((args) => (args.error = new Error('www')));
    expect(cache.get.bind(cache, op, 'def')).toThrowError('www');
  });

  it('should throw any error thrown by the trace', () => {
    spy.and.throwError('eee');
    expect(cache.get.bind(cache, op, 'data')).toThrowError('eee');
  });

  // TODO Test nested operators
});
});
});
