import { Injectable } from '@angular/core';
import { invoke } from 'lodash';
import {
  Category, CategoryConfiguration, CategoryLogFormat, CategoryLogger, CategoryServiceFactory,
  LoggerType, LogLevel as ImplLogLevel, RuntimeSettings
} from 'typescript-logging';
import { LogData } from '../../types';
import { LogLevel, LogLevel_Ext } from '../../log-levels';
import { Logger, LoggerConfig, LoggerFactory } from '../../logging';

namespace Utility {
  export function createIntermediateCategories(logger: TypescriptLogger): Category {
    const parents = logger.parents;
    const index = parents.findIndex((parent) => parent instanceof TypescriptLogger); // tslint:disable-line:no-use-before-declare
    const names = (index >= 0 ? parents.slice(0, index) : parents).map((parent) => parent.name);
    const firstCategory = index >= 0 ? (parents[index] as TypescriptLogger).category : new Category('root');
    const parentCategory = names.reduceRight(((parent, name) => new Category(name, parent)), firstCategory);
    return parentCategory;
  }
}

@Injectable({
  providedIn: 'root'
})
export class TypescriptLoggerFactory extends LoggerFactory {
  // Workaround: Will be fixed by https://github.com/angular/angular/pull/25736
  static ngInjectableDef = undefined;

  createLogger(parent: Logger, config: LoggerConfig): Logger {
    return new TypescriptLogger(parent, config); // tslint:disable-line:no-use-before-declare
  }

  configure(
    type: LoggerType = LoggerType.Console,
    format: CategoryLogFormat = new CategoryLogFormat(),
    createLogger?: (root: Category, setting: RuntimeSettings) => CategoryLogger
  ): void {
    const config = new CategoryConfiguration(ImplLogLevel.Trace, type, format, createLogger || null);
    CategoryServiceFactory.setDefaultConfiguration(config, true);
  }
}

export class TypescriptLogger extends Logger {
  readonly category: Category;

  constructor(parent: Logger, config: LoggerConfig) {
    super(parent, config);
    this.category = new Category(config.name, Utility.createIntermediateCategories(this));
  }

  protected doLog(level: LogLevel, msg: () => LogData, error?: () => Error): void {
    const methodName = LogLevel_Ext.toString(level).toLowerCase();
    const args = level < LogLevel.Error ? [msg] : [msg, error];
    invoke(this.category, methodName, ...args);
  }
}
