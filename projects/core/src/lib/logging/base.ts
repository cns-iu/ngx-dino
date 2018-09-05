import { Inject, Injectable, InjectionToken, OnDestroy, Optional, Provider, Self, SkipSelf, Type } from '@angular/core';
import { defaultTo, isFunction, isString } from 'lodash';
import { ErrorType, LogData, MessageType } from './types';
import { LogLevel } from './log-levels';


namespace Utility {
  function normalizeDataMessage(msg: string | LogData): LogData {
    return isString(msg) ? { msg } : msg;
  }

  export function normalizeMessage(msg: MessageType): () => LogData {
    if (isFunction(msg)) {
      return () => normalizeDataMessage(msg());
    } else {
      const normMsg = normalizeDataMessage(msg);
      return () => normMsg;
    }
  }

  export function normalizeError(error: ErrorType): () => Error {
    return isFunction(error) ? error : () => error;
  }
}


// Logger Configuration
export const LoggerConfig = new InjectionToken<LoggerConfig>('Logger Configuration');
export interface LoggerConfig {
  name: string;
  level?: LogLevel;
  implConfig?: any;
}


// Logger Factory Base Class
@Injectable({
  providedIn: 'root'
})
export class LoggerFactory {
  static use<C extends Type<LoggerFactory>>(factory: C): Provider {
    return {
      provide: LoggerFactory,
      useExisting: factory
    };
  }

  createLogger(parent: Logger, config: LoggerConfig): Logger {
    return new Logger(parent, config); // tslint:disable-line:no-use-before-declare
  }
}


// Logger Base Class
// @dynamic
@Injectable({
  providedIn: 'root',
  useFactory: () => new Logger(undefined, { name: 'root' })
})
export class Logger implements OnDestroy {
  readonly name: string;
  readonly parent?: Logger;
  readonly children: Logger[] = [];
  private _parents: Logger[];
  private _level: LogLevel;

  get parents(): Logger[] { return this._parents || (this._parents = this.getAllParents()); }
  get level(): LogLevel { return this._level; }

  static withConfig(config: LoggerConfig): Provider {
    return {
      provide: LoggerConfig,
      useValue: config
    };
  }

  static create(): Provider {
    return {
      provide: Logger,
      useFactory(factory: LoggerFactory, parent: Logger | undefined, config: LoggerConfig): Logger {
        return factory.createLogger(parent, config);
      },
      deps: [LoggerFactory, [new Optional(), new SkipSelf(), Logger], [new Self(), LoggerConfig]]
    };
  }

  constructor(parent: Logger, @Inject('this does not exist') config: LoggerConfig) {
    this.name = config.name;
    this.parent = parent || undefined;
    this._level = defaultTo(config.level, LogLevel.Error);

    if (parent) {
      parent.children.push(this);
    }
  }

  ngOnDestroy(): void {
    if (this.parent) {
      const index = this.parent.children.indexOf(this);
      if (index >= 0) { // Should always be true
        this.parent.children.splice(index, 1);
      }
    }
  }

  setLevel(level: LogLevel, propagate = true): void {
    this._level = level;
    this.doSetLevel(level, propagate);
    if (propagate) {
      this.children.forEach((child) => child.setLevel(level, true));
    }
  }

  isLevelEnabled(level: LogLevel): boolean { return level >= this.level && level !== LogLevel.Off; }
  isTraceEnabled(): boolean { return this.isLevelEnabled(LogLevel.Trace); }
  isDebugEnabled(): boolean { return this.isLevelEnabled(LogLevel.Debug); }
  isInfoEnabled(): boolean { return this.isLevelEnabled(LogLevel.Info); }
  isWarnEnabled(): boolean { return this.isLevelEnabled(LogLevel.Warn); }
  isErrorEnabled(): boolean { return this.isLevelEnabled(LogLevel.Error); }
  isFatalEnabled(): boolean { return this.isLevelEnabled(LogLevel.Fatal); }

  log(level: LogLevel, msg: MessageType, error?: ErrorType): void {
    if (!this.isLevelEnabled(level) || level === LogLevel.Off) {
      return;
    }

    this.doLog(level, Utility.normalizeMessage(msg), error && Utility.normalizeError(error));
  }
  trace(msg: MessageType): void { this.log(LogLevel.Trace, msg); }
  debug(msg: MessageType): void { this.log(LogLevel.Debug, msg); }
  info(msg: MessageType): void { this.log(LogLevel.Info, msg); }
  warn(msg: MessageType): void { this.log(LogLevel.Warn, msg); }
  error(msg: MessageType, error: ErrorType): void { this.log(LogLevel.Error, msg, error); }
  fatal(msg: MessageType, error: ErrorType): void { this.log(LogLevel.Fatal, msg, error); }

  // Methods that can be overridden in derived loggers
  protected doLog(level: LogLevel, msg: () => LogData, error?: () => Error): void {
    // Default does nothing
  }

  protected doSetLevel(level: LogLevel, propagate: boolean): void {
    // Default does nothing
  }


  private getAllParents(): Logger[] {
    const parents: Logger[] = [];
    let current = this.parent;
    while (current) {
      parents.push(current);
      current = current.parent;
    }

    return parents;
  }
}
