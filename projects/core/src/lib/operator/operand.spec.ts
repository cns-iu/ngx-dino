import { Operator } from './operator-class';
import { Operand } from './operand';

function unused(...args: any[]) {}

describe('Operand', () => {
let obj: { prop?: any };
let operator: Operator<unknown, unknown>;
let spy: jasmine.Spy;

beforeEach(() => {
  operator = new Operator(spy = jasmine.createSpy());
  obj = {};
});

describe('Operand(operator, false)', () => {
  let decorator: (target: any, key: string | symbol) => void;

  beforeEach(() => {
    decorator = Operand(operator, false);
    decorator(obj, 'prop');
  });

  it('returns a decorator', () => {
    expect(decorator).toEqual(jasmine.any(Function));
  });

  it('creates a getter', () => {
    const descriptor = Object.getOwnPropertyDescriptor(obj, 'prop');
    expect(descriptor).toEqual(jasmine.objectContaining({ get: jasmine.any(Function) }));
  });

  it('calls the Operator on each call', () => {
    unused(obj.prop);
    unused(obj.prop);
    expect(spy).toHaveBeenCalledTimes(2);
  });
});

describe('Operand(operator, true)', () => {
  let decorator: (target: any, key: string | symbol) => void;

  beforeEach(() => {
    decorator = Operand(operator, true);
    decorator(obj, 'prop');
  });

  it('returns a decorator', () => {
    expect(decorator).toEqual(jasmine.any(Function));
  });

  it('creates a getter', () => {
    const descriptor = Object.getOwnPropertyDescriptor(obj, 'prop');
    expect(descriptor).toEqual(jasmine.objectContaining({ get: jasmine.any(Function) }));
  });

  it('calls the Operator once and caches the result', () => {
    unused(obj.prop);
    unused(obj.prop);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
});
