import { Logger, LoggerBuilder, LogLevel, ILogEntry } from '../core';

export interface ReactLogContext<T = any> {
  component?: string;
  userId?: string;
  action?: string;
  props?: Record<string, any>;
  state?: Record<string, any>;
}

export interface LoggerHookResult<T = any> {
  logger: Logger<T>;
  info: (message: string, context?: T) => Promise<void>;
  debug: (message: string, context?: T) => Promise<void>;
  warn: (message: string, context?: T) => Promise<void>;
  error: (message: string, error?: Error, context?: T) => Promise<void>;
  fatal: (message: string, error?: Error, context?: T) => Promise<void>;
  table: (title: string, data: any[] | object) => void;
  group: (title: string, fn?: () => void) => void;
  groupCollapsed: (title: string, fn?: () => void) => void;
  groupEnd: () => void;
  time: (label: string) => void;
  timeEnd: (label: string) => void;
  count: (label: string) => void;
  countReset: (label: string) => void;
  trace: (message: string, ...args: any[]) => void;
  dir: (obj: any, options?: any) => void;
}
