import {
  isInteger, isNumber, isString, map, reduce,
  toInteger, toNumber, toString
} from 'lodash';

export enum Type {
  Integer,
  Number,
  String,
  Any
}

// Test regexes
const integerRegex = /^(?:[+-]?0|[1-9]\d*|0[1-7]+|0b[01]+|0o[0-7]+|0x[0-9a-f]+)$/i;
const numberRegex = /^(?:[+-]?([1-9]\d*)?(\.)?(\d*)?(e[+-]?\d+)?)$/i;

// Type testing
interface TypeTester {
  (value: any): boolean;
  type: Type;
  downgraded: TypeTester;
}

// Any type test
function testAny(value: any): boolean { return true; }
testAny.type = Type.Any;
testAny.downgraded = testAny;

// String type test
function testString(value: any): boolean { return isString(value) || isNumber(value); }
testString.type = Type.String;
testString.downgraded = testAny;

// Number type test
function testNumber(value: any): boolean {
  if (isNumber(value) || integerRegex.test(value)) {
    return true;
  }

  const match = numberRegex.exec(value);
  return Boolean(match && (match[1] || match[3]) && (match[2] || match[4]));
}
testNumber.type = Type.Number;
testNumber.downgraded = testString;

// Integer type test
function testInteger(value: any): boolean { return isInteger(value) || integerRegex.test(value); }
testInteger.type = Type.Integer;
testInteger.downgraded = testNumber;


// Helpers
function downgrade(tester: TypeTester, value: any): TypeTester {
  let next = tester.downgraded;

  while (!next(value) && next !== next.downgraded) { next = next.downgraded; }
  return next;
}

function accumulator(tester: TypeTester, value: any): TypeTester {
  return tester(value) ? tester : downgrade(tester, value);
}


export function sniffType(values: any[]): Type {
  return reduce(values, accumulator, testInteger).type;
}

export function coerceToType(values: any[], type: Type.Integer | Type.Number): number[];
export function coerceToType(values: any[], type: Type.String): string[];
export function coerceToType(values: any[], type: Type): any[];
export function coerceToType(values: any[], type: Type): any[] {
  let coerceFun: Function;
  switch (type) {
    case Type.Integer:
      coerceFun = toInteger;
      break;
    case Type.Number:
      coerceFun = toNumber;
      break;
    case Type.String:
      coerceFun = toString;
      break;
    default:
      coerceFun = undefined;
      break;
  }

  return coerceFun ? map(values, coerceFun) : values;
}
