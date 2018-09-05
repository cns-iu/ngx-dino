import { TestBed, inject } from '@angular/core/testing';
import {
  CategoryConfiguration, CategoryDelegateLoggerImpl, CategoryMessageBufferLoggerImpl, CategoryServiceFactory,
  LoggerType, LogLevel as ImplLogLevel
} from 'typescript-logging';
import { LogLevel } from '../../log-levels';
import { Logger, LoggerFactory } from '../../base';
import { TypescriptLogger, TypescriptLoggerFactory } from './impl';

describe('logging', () => {

// Copied with modifications from typescript-logging spec
// https://github.com/mreuvers/typescript-logging/blob/master/spec/categoryLoggerSpec.ts
function getMessageBufferLogger(logger: TypescriptLogger): CategoryMessageBufferLoggerImpl {
  const category = logger.category;
  (category as any).loadCategoryLogger(); // Ensure logger is loaded

  const delegate = (category as any)._logger as CategoryDelegateLoggerImpl;
  const messageLogger = (delegate && delegate.delegate) as CategoryMessageBufferLoggerImpl;

  expect(messageLogger).toBeDefined();
  expect(messageLogger).toEqual(jasmine.any(CategoryMessageBufferLoggerImpl));
  return messageLogger;
}

beforeEach(() => {
  const config = new CategoryConfiguration(ImplLogLevel.Trace, LoggerType.MessageBuffer);
  CategoryServiceFactory.clear();
  CategoryServiceFactory.setDefaultConfiguration(config, true);
});

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      LoggerFactory.use(TypescriptLoggerFactory),
      Logger.withConfig({ name: 'test', level: LogLevel.Warn }),
      Logger.create()
    ]
  });
});

describe('TypescriptLoggerFactory', () => {
  it('creates', inject([LoggerFactory], (factory: LoggerFactory) => {
    expect(factory).toBeDefined();
  }));

  it('is an instance of `TypescriptLoggerFactory`', inject([LoggerFactory], (factory: LoggerFactory) => {
    expect(factory).toEqual(jasmine.any(TypescriptLoggerFactory));
  }));

  describe('createLogger(parent, config)', () => {
    it('creates instances of `TypescriptLogger`', inject([LoggerFactory, Logger], (factory: LoggerFactory, parent: Logger) => {
      const logger = factory.createLogger(parent, { name: 'foo' });
      expect(logger).toEqual(jasmine.any(TypescriptLogger));
    }));
  });

  describe('configure(type?, format?, create?)', () => {
    // FIXME: How to test this since it is very difficult to access typescript-logging's runtime settings?
  });
});

describe('TypescriptLogger', () => {
  it('creates', inject([Logger], (logger: Logger) => {
    expect(logger).toBeDefined();
  }));

  it('is an instance of `TypescriptLogger`', inject([Logger], (logger: Logger) => {
    expect(logger).toEqual(jasmine.any(TypescriptLogger));
  }));

  describe('log(level, msg, error?)', () => {
    it('logs to the underlying category', inject([Logger], (logger: TypescriptLogger) => {
      const msg = 'foo doo boo';
      const messageBuffer = getMessageBufferLogger(logger);
      logger.log(LogLevel.Error, msg);
      expect(messageBuffer.toString()).toContain(msg);
    }));
  });
});
});
