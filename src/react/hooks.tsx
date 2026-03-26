import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Logger, LoggerBuilder, LogLevel, ILogEntry } from '../core';
import { ReactLogContext, LoggerHookResult } from './types';

interface ReactLoggerConfig {
  appName?: string;
  enableColors?: boolean;
  enableChangeTracking?: boolean;
  bufferSize?: number;
  flushInterval?: number;
}

const LoggerContext = createContext<Logger<ReactLogContext> | null>(null);

export function LoggerProvider<T = ReactLogContext>({ 
  children, 
  config = {},
  customLogger 
}: { 
  children: React.ReactNode;
  config?: ReactLoggerConfig;
  customLogger?: Logger<T>;
}) {
  const loggerRef = useRef<Logger<T> | null>(null);

  if (!loggerRef.current) {
    if (customLogger) {
      loggerRef.current = customLogger as any;
    } else {
      loggerRef.current = new LoggerBuilder<T>()
        .setAppName(config.appName || 'react-app')
        .useFormat('styled')
        .enableColors(config.enableColors ?? true)
        .enableChangeTracking(config.enableChangeTracking ?? false)
        .setBufferSize(config.bufferSize ?? 100)
        .setFlushInterval(config.flushInterval ?? 5000)
        .build() as any;
    }
  }

  return (
    <LoggerContext.Provider value={loggerRef.current as any}>
      {children}
    </LoggerContext.Provider>
  );
}

export function useLogger<T = ReactLogContext>(componentName?: string): LoggerHookResult<T> {
  const logger = useContext(LoggerContext) as Logger<T>;
  const [component] = useState(componentName || 'Unknown');

  useEffect(() => {
    if (logger && componentName) {
      logger.info(`Component mounted`, { component } as any);
    }
    return () => {
      if (logger && componentName) {
        logger.info(`Component unmounted`, { component } as any);
      }
    };
  }, [logger, component]);

  if (!logger) {
    throw new Error('useLogger must be used within a LoggerProvider');
  }

  return {
    logger,
    info: async (message: string, context?: T) => {
      const enhancedContext = { ...context, component } as any;
      await logger.info(message, enhancedContext);
    },
    debug: async (message: string, context?: T) => {
      const enhancedContext = { ...context, component } as any;
      await logger.debug(message, enhancedContext);
    },
    warn: async (message: string, context?: T) => {
      const enhancedContext = { ...context, component } as any;
      await logger.warn(message, enhancedContext);
    },
    error: async (message: string, error?: Error, context?: T) => {
      const enhancedContext = { ...context, component } as any;
      await logger.error(message, error, enhancedContext);
    },
    fatal: async (message: string, error?: Error, context?: T) => {
      const enhancedContext = { ...context, component } as any;
      await logger.fatal(message, error, enhancedContext);
    },
    table: (title: string, data: any[] | object) => {
      logger.table(title, data);
    },
    group: (title: string, fn?: () => void) => {
      logger.group(title, fn);
    },
    groupCollapsed: (title: string, fn?: () => void) => {
      logger.groupCollapsed(title, fn);
    },
    groupEnd: () => {
      logger.groupEnd();
    },
    time: (label: string) => {
      logger.time(label);
    },
    timeEnd: (label: string) => {
      logger.timeEnd(label);
    },
    count: (label: string) => {
      logger.count(label);
    },
    countReset: (label: string) => {
      logger.countReset(label);
    },
    trace: (message: string, ...args: any[]) => {
      logger.trace(message, ...args);
    },
    dir: (obj: any, options?: any) => {
      logger.dir(obj, options);
    }
  };
}
