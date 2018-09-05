import { TestBed, inject } from '@angular/core/testing';
import { ErrorType, MessageType } from './types';
import { LogLevel } from './log-levels';
import { Logger, LoggerConfig, LoggerFactory } from './logging';

describe('logging', () => {

class TestLogger extends Logger { }
class TestLoggerFactory extends LoggerFactory {
  createLogger(parent: Logger, config: LoggerConfig): Logger {
    return new TestLogger(parent, config);
  }
}

describe('Root LoggerFactory', () => {
  it('creates', inject([LoggerFactory], (factory: LoggerFactory) => {
    expect(factory).toBeDefined();
  }));
});

describe('LoggerFactory', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TestLoggerFactory,
        LoggerFactory.use(TestLoggerFactory)
      ]
    });
  });

  it('creates', inject([LoggerFactory], (factory: LoggerFactory) => {
    expect(factory).toBeDefined();
  }));

  it('is an instance of the specified class', inject([LoggerFactory], (factory: LoggerFactory) => {
    expect(factory).toEqual(jasmine.any(TestLoggerFactory));
  }));

  describe('createLogger(parent, config)', () => {
    it('creates a logger', inject([LoggerFactory], (factory: LoggerFactory) => {
      expect(factory.createLogger(undefined, { name: 'my-logger' })).toEqual(jasmine.any(Logger));
    }));

    it('sets the loggers parent', inject([LoggerFactory], (factory: LoggerFactory) => {
      const parent = new Logger(undefined, { name: 'foo' });
      const logger = factory.createLogger(parent, { name: 'bar' });
      expect(logger.parent).toBe(parent);
    }));

    it('sets the loggers name', inject([LoggerFactory], (factory: LoggerFactory) => {
      const logger = factory.createLogger(undefined, { name: 'qwerty' });
      expect(logger.name).toBe('qwerty');
    }));
  });
});

describe('Root Logger', () => {
  it('exists', inject([Logger], (logger: Logger) => {
    expect(logger).toBeDefined();
  }));

  it('has no parent', inject([Logger], (logger: Logger) => {
    expect(logger.parent).toBeUndefined();
  }));

  it('has the name `root`', inject([Logger], (logger: Logger) => {
    expect(logger.name).toBe('root');
  }));

  it('has level of `Error`', inject([Logger], (logger: Logger) => {
    expect(logger.level).toBe(LogLevel.Error);
  }));
});

describe('Logger', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TestLoggerFactory,
        LoggerFactory.use(TestLoggerFactory),
        Logger.withConfig({ name: 'foo', level: LogLevel.Debug }),
        Logger.create()
      ]
    });
  });

  it('creates', inject([Logger], (logger: Logger) => {
    expect(logger).toBeDefined();
  }));

  it('is an instance of the specified class', inject([Logger], (logger: Logger) => {
    expect(logger).toEqual(jasmine.any(TestLogger));
  }));

  it('has a parent', inject([Logger], (logger: Logger) => {
    const child = new Logger(logger, { name: 'child' });
    expect(child.parent).toBe(logger);
  }));

  it('has an array of parents', inject([Logger], (logger: Logger) => {
    const child = new Logger(logger, { name: 'child' });
    expect(child.parents).toEqual([logger]);
  }));

  it('has an array of children', inject([Logger], (logger: Logger) => {
    const child = new Logger(logger, { name: 'child' });
    expect(logger.children).toBeDefined();
    expect(logger.children).toContain(child);
  }));

  it('has the specified name', inject([Logger], (logger: Logger) => {
    expect(logger.name).toBe('foo');
  }));

  it('has the specified log level', inject([Logger], (logger: Logger) => {
    expect(logger.level).toBe(LogLevel.Debug);
  }));

  describe('setLevel(level, propagate?)', () => {
    it('changes the log level', inject([Logger], (logger: Logger) => {
      logger.setLevel(LogLevel.Info);
      expect(logger.level).toBe(LogLevel.Info);
    }));

    it('does not change child log levels when propagate === false', inject([Logger], (logger: Logger) => {
      const child = new Logger(logger, { name: 'child' });
      logger.setLevel(LogLevel.Warn, false);
      expect(child.level).not.toBe(LogLevel.Warn);
    }));

    it('changes the child log levels when propagate === true', inject([Logger], (logger: Logger) => {
      const child = new Logger(logger, { name: 'child' });
      logger.setLevel(LogLevel.Fatal, true);
      expect(child.level).toBe(LogLevel.Fatal);
    }));

    it('calls doSetLevel', inject([Logger], (logger: Logger) => {
      const spy = spyOn(logger as any, 'doSetLevel');
      logger.setLevel(LogLevel.Trace);
      expect(spy).toHaveBeenCalled();
    }));

    it('calls doSetLevel with the same level', inject([Logger], (logger: Logger) => {
      const spy = spyOn(logger as any, 'doSetLevel');
      logger.setLevel(LogLevel.Trace);
      expect(spy).toHaveBeenCalledWith(LogLevel.Trace, jasmine.any(Boolean));
    }));

    it('calls doSetLevel with the same propagation', inject([Logger], (logger: Logger) => {
      const spy = spyOn(logger as any, 'doSetLevel');
      logger.setLevel(LogLevel.Trace, false);
      expect(spy).toHaveBeenCalledWith(jasmine.any(Number), false);
    }));
  });

  describe('isLevelEnabled(level)', () => {
    it('is true for log levels greater or equal to the logger\'s level', inject([Logger], (logger: Logger) => {
      expect(logger.isLevelEnabled(LogLevel.Fatal)).toBeTruthy();
    }));

    it('is false for log levels less than the logger\'s level', inject([Logger], (logger: Logger) => {
      expect(logger.isLevelEnabled(LogLevel.Trace)).toBeFalsy();
    }));

    it('is false for log level `Off`', inject([Logger], (logger: Logger) => {
      expect(logger.isLevelEnabled(LogLevel.Off)).toBeFalsy();
    }));
  });

  describe('log(level, msg, error?)', () => {
    function spyOnDoLog(logger: Logger, level: LogLevel, msg: MessageType, error?: ErrorType): jasmine.Spy {
      const messageMatcher = jasmine.any(Function);
      const errorMatcher = error ? jasmine.any(Function) : undefined;
      const spy = spyOn(logger as any, 'doLog');

      logger.log(level, msg, error);
      if (logger.isLevelEnabled(level)) {
        expect(spy).toHaveBeenCalledWith(level, messageMatcher, errorMatcher);
      }

      return spy;
    }

    it('calls doLog', inject([Logger], (logger: Logger) => {
      spyOnDoLog(logger, LogLevel.Fatal, 'a message');
    }));

    it('calls doLog with the same level', inject([Logger], (logger: Logger) => {
      spyOnDoLog(logger, LogLevel.Error, 'another message');
    }));

    it('calls doLog with the same message', inject([Logger], (logger: Logger) => {
      const msg = 'foo bar';
      const spy = spyOnDoLog(logger, LogLevel.Fatal, msg);
      const dataCallback = spy.calls.mostRecent().args[1];
      expect(dataCallback()).toEqual(jasmine.objectContaining({ msg }));
    }));

    it('calls doLog with the same error', inject([Logger], (logger: Logger) => {
      const error = new Error('some error');
      const spy = spyOnDoLog(logger, LogLevel.Error, 'unimportant', error);
      const errorCallback = spy.calls.mostRecent().args[2];
      expect(errorCallback()).toBe(error);
    }));

    it('does not call doLog for disabled levels', inject([Logger], (logger: Logger) => {
      const spy = spyOnDoLog(logger, LogLevel.Trace, 'qwerty');
      expect(spy).not.toHaveBeenCalled();
    }));

    it('does not call doLog for log level `Off`', inject([Logger], (logger: Logger) => {
      const spy = spyOnDoLog(logger, LogLevel.Off, '123');
      expect(spy).not.toHaveBeenCalled();
    }));
  });
});
});
