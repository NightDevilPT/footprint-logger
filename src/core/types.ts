export enum LogLevel {
  DEBUG = 10,
  INFO = 20,
  WARN = 30,
  ERROR = 40,
  FATAL = 50
}

export interface ILogEntry<T = any> {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: T;
  error?: Error;
  pid: number;
  hostname: string;
  appName?: string;
  correlationId?: string;
}

export interface ILogChange<T = any> {
  entry: ILogEntry<T>;
  before?: T;
  after?: T;
  changes?: Partial<Record<keyof T, { before: any; after: any }>>;
}

export interface IFormatter<T = any> {
  format(entry: ILogEntry<T>): string | any[];
  getType(): string;
}

export interface ITransport<T = any> {
  write(data: T): Promise<void>;
  close(): Promise<void>;
  getType(): string;
}

export interface BatchEntry<T = any> {
  level: LogLevel;
  message: string;
  context?: T;
  error?: Error;
}

export type TransportType = 'terminal' | 'file' | 'json-file';
export type FormatterType = 'pretty' | 'json' | 'logfmt' | 'styled';

export interface LoggerConfig {
  appName?: string;
  transport?: TransportType;
  customTransport?: ITransport;
  formatter?: FormatterType;
  customFormatter?: IFormatter;
  filePath?: string;
  enableColors?: boolean;
  colorConfig?: ColorConfig;
  enableMasking?: boolean;
  maskingPatterns?: MaskingPattern[];
  bufferSize?: number;
  flushInterval?: number;
  maxFileSize?: number;
  maxFiles?: number;
  retentionDays?: number;
  enableCompression?: boolean;
  enableChangeTracking?: boolean;
  environment?: 'node' | 'browser' | 'unknown';
}

export interface MaskingPattern {
  pattern: RegExp;
  replacement: string;
  description?: string;
}

export interface ColorConfig {
  info?: LevelColorConfig;
  debug?: LevelColorConfig;
  warn?: LevelColorConfig;
  error?: LevelColorConfig;
  fatal?: LevelColorConfig;
  timestamp?: TimestampColorConfig;
  message?: MessageColorConfig;
}

export interface LevelColorConfig {
  color?: string;
  bgColor?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export interface TimestampColorConfig {
  color?: string;
  bold?: boolean;
}

export interface MessageColorConfig {
  color?: string;
}

export type Environment = 'node' | 'browser' | 'unknown';
