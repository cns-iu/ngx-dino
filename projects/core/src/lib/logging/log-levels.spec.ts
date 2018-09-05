import { LogLevel, LogLevel_Ext } from './log-levels';

describe('logging', () => {
describe('LogLevel', () => {
describe('LogLevel_Ext.fromString(name, default?)', () => {
  it('returns the correct level', () => {
    expect(LogLevel_Ext.fromString('trace')).toBe(LogLevel.Trace);
  });

  it('returns the default on failure if provided', () => {
    expect(LogLevel_Ext.fromString('bad level', LogLevel.Error)).toBe(LogLevel.Error);
  });

  it('throws on failure if no default is provided', () => {
    expect(() => LogLevel_Ext.fromString('bad level')).toThrow();
  });
});

describe('LogLevel_Ext.toString(level, default?)', () => {
  it('returns a string representation', () => {
    expect(LogLevel_Ext.toString(LogLevel.Debug)).toMatch(/debug/i);
  });

  it('returns the default on failure if provided', () => {
    expect(LogLevel_Ext.toString(Infinity, 'foo')).toBe('foo');
  });

  it('throws on failure in no default is provided', () => {
    expect(() => LogLevel_Ext.toString(Infinity)).toThrow();
  });
});
});
});
