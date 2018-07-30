/// <reference path="./one-of.d.ts" />
import { makeMatcherFactory } from './utility/make-matcher-factory';


function compare<T>(
  util: jasmine.MatchersUtil,
  testers: jasmine.CustomEqualityTester[],
  actual: T,
  oneOf: T[]
): jasmine.CustomMatcherResult {
  const pass = util.contains(oneOf, actual, testers);
  const oneOfString = oneOf.join(', ');
  const passMessage = `Expected ${actual} to not be any of ${oneOfString}`;
  const failureMessage = `Expected ${actual} to be one of ${oneOfString}`;
  const message = pass ? passMessage : failureMessage

  if (oneOf.length === 0) {
    throw new Error('Expected must have least one element');
  }

  return {pass, message};
}

export default {
  toBeOneOf: makeMatcherFactory(compare)
};
