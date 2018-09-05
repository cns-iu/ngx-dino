import { capitalize, defaultTo } from 'lodash';

export enum LogLevel {
  Trace,
  Debug,
  Info,
  Warn,
  Error,
  Fatal,
  Off
}

// Should be `LogLevel`. Caused by https://github.com/ng-packagr/ng-packagr/issues/680
export namespace LogLevel_Ext {
  export function fromString(name: string, defaultValue?: LogLevel): LogLevel {
    const level = defaultTo(LogLevel[capitalize(name)], defaultValue);
    if (level === undefined) {
      throw new Error(`Unknown log level name: ${name}`);
    }
    return level;
  }

  export function toString(level: LogLevel, defaultValue?: string): string {
    const name = LogLevel[level] || defaultValue;
    if (name === undefined) {
      throw new Error(`Unknown log level: ${level}`);
    }
    return name;
  }
}
