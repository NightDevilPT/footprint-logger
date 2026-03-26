import {
  LogLevel,
  ILogEntry,
  ILogChange,
  IFormatter,
  ITransport,
  LoggerConfig,
  BatchEntry,
  TransportType,
  FormatterType
} from './types';
import { LogEntry } from './LogEntry';
import { PrettyFormatter } from './formatters/PrettyFormatter';
import { JsonFormatter } from './formatters/JsonFormatter';
import { LogfmtFormatter } from './formatters/LogfmtFormatter';
import { StyledFormatter } from './formatters/StyledFormatter';
import { TerminalTransport } from './transports/TerminalTransport';
import { FileTransport } from './transports/FileTransport';
import { JsonFileTransport } from './transports/JsonFileTransport';
import { ColorManager } from './styling/IColorStrategy';

export class Logger<T = any> {
  private formatter: IFormatter<T>;
  private transport: ITransport<T>;
  private config: LoggerConfig;
  private buffer: ILogEntry<T>[] = [];
  private flushTimer?: NodeJS.Timeout;

  constructor(config: LoggerConfig = {}) {
    this.config = config;
    this.formatter = this.createFormatter(config);
    this.transport = this.createTransport(config);
    
    if (config.bufferSize && config.flushInterval) {
      this.startFlushTimer();
    }
  }

  async info(message: string, context?: T): Promise<ILogChange<T> | void> {
    return this.log(LogLevel.INFO, message, context);
  }

  async debug(message: string, context?: T): Promise<ILogChange<T> | void> {
    return this.log(LogLevel.DEBUG, message, context);
  }

  async warn(message: string, context?: T): Promise<ILogChange<T> | void> {
    return this.log(LogLevel.WARN, message, context);
  }

  async error(message: string, error?: Error, context?: T): Promise<ILogChange<T> | void> {
    return this.log(LogLevel.ERROR, message, context, error);
  }

  async fatal(message: string, error?: Error, context?: T): Promise<ILogChange<T> | void> {
    return this.log(LogLevel.FATAL, message, context, error);
  }

  async logChange(message: string, before: T, after: T, context?: T): Promise<ILogChange<T>> {
    const change = LogEntry.createChange(
      LogLevel.INFO,
      message,
      before,
      after,
      context,
      undefined,
      this.config.appName,
      this.generateCorrelationId()
    );

    await this.writeEntry(change.entry);
    return change;
  }

  table(title: string, data: any[] | object): void {
    if (typeof console !== 'undefined' && console.table) {
      console.table(data);
    } else {
      console.log(`${title}:`, data);
    }
  }

  group(title: string, fn?: () => void): void {
    if (typeof console !== 'undefined' && console.group) {
      console.group(title);
      if (fn) fn();
      console.groupEnd();
    } else {
      console.log(`--- ${title} ---`);
      if (fn) fn();
      console.log(`--- End ${title} ---`);
    }
  }

  groupCollapsed(title: string, fn?: () => void): void {
    if (typeof console !== 'undefined' && console.groupCollapsed) {
      console.groupCollapsed(title);
      if (fn) fn();
      console.groupEnd();
    } else {
      console.log(`--- ${title} (collapsed) ---`);
      if (fn) fn();
      console.log(`--- End ${title} ---`);
    }
  }

  groupEnd(): void {
    if (typeof console !== 'undefined' && console.groupEnd) {
      console.groupEnd();
    }
  }

  time(label: string): void {
    if (typeof console !== 'undefined' && console.time) {
      console.time(label);
    }
  }

  timeEnd(label: string): void {
    if (typeof console !== 'undefined' && console.timeEnd) {
      console.timeEnd(label);
    }
  }

  count(label: string): void {
    if (typeof console !== 'undefined' && console.count) {
      console.count(label);
    }
  }

  countReset(label: string): void {
    if (typeof console !== 'undefined' && console.countReset) {
      console.countReset(label);
    }
  }

  trace(message: string, ...args: any[]): void {
    if (typeof console !== 'undefined' && console.trace) {
      console.trace(message, ...args);
    }
  }

  dir(obj: any, options?: any): void {
    if (typeof console !== 'undefined' && console.dir) {
      console.dir(obj, options);
    }
  }

  async batch(entries: BatchEntry<T>[]): Promise<void> {
    for (const entry of entries) {
      await this.log(entry.level, entry.message, entry.context, entry.error);
    }
  }

  async flush(): Promise<void> {
    if (this.buffer.length > 0) {
      const entriesToFlush = [...this.buffer];
      this.buffer = [];
      
      for (const entry of entriesToFlush) {
        await this.writeEntry(entry);
      }
    }
  }

  async shutdown(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    await this.flush();
    await this.transport.close();
  }

  private async log(level: LogLevel, message: string, context?: T, error?: Error): Promise<ILogChange<T> | void> {
    const entry = new LogEntry<T>(
      level,
      message,
      context,
      error,
      this.config.appName,
      this.generateCorrelationId()
    );

    if (this.config.bufferSize && this.config.bufferSize > 1) {
      this.buffer.push(entry);
      
      if (this.buffer.length >= this.config.bufferSize) {
        await this.flush();
      }
    } else {
      await this.writeEntry(entry);
    }
  }

  private async writeEntry(entry: ILogEntry<T>): Promise<void> {
    const formatted = this.formatter.format(entry);
    await this.transport.write(formatted as any);
  }

  private createFormatter(config: LoggerConfig): IFormatter<T> {
    if (config.customFormatter) {
      return config.customFormatter;
    }

    const formatterType = config.formatter || 'pretty';
    const colorConfig = config.colorConfig || ColorManager.getDefaultColors();
    const environment = config.environment || ColorManager.detectEnvironment();

    switch (formatterType) {
      case 'pretty':
        return new PrettyFormatter<T>();
      case 'json':
        return new JsonFormatter<T>();
      case 'logfmt':
        return new LogfmtFormatter<T>();
      case 'styled':
        return new StyledFormatter<T>(colorConfig, environment);
      default:
        return new PrettyFormatter<T>();
    }
  }

  private createTransport(config: LoggerConfig): ITransport<T> {
    if (config.customTransport) {
      return config.customTransport;
    }

    const transportType = config.transport || 'terminal';
    const filePath = config.filePath || './logs/app.log';

    switch (transportType) {
      case 'terminal':
        return new TerminalTransport<T>();
      case 'file':
        return new FileTransport<T>(filePath);
      case 'json-file':
        return new JsonFileTransport<T>(filePath);
      default:
        return new TerminalTransport<T>();
    }
  }

  private startFlushTimer(): void {
    const interval = this.config.flushInterval || 5000;
    this.flushTimer = setInterval(() => {
      this.flush().catch(console.error);
    }, interval);
  }

  private generateCorrelationId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
