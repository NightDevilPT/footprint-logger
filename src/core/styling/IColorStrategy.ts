import { LogLevel, ColorConfig, LevelColorConfig, Environment } from '../types';

export interface IColorStrategy {
  applyStyle(level: LogLevel, text: string, config?: LevelColorConfig): string;
  getEnvironment(): Environment;
}

export class ColorManager {
  private static defaultColors: ColorConfig = {
    info: { color: 'blue', bold: false },
    debug: { color: 'gray', bold: false },
    warn: { color: 'yellow', bold: true },
    error: { color: 'red', bold: true },
    fatal: { color: 'red', bgColor: 'white', bold: true },
    timestamp: { color: 'gray', bold: false },
    message: { color: 'white' }
  };

  static getDefaultColors(): ColorConfig {
    return { ...this.defaultColors };
  }

  static mergeColors(base: ColorConfig, override: ColorConfig): ColorConfig {
    return {
      info: { ...base.info, ...override.info },
      debug: { ...base.debug, ...override.debug },
      warn: { ...base.warn, ...override.warn },
      error: { ...base.error, ...override.error },
      fatal: { ...base.fatal, ...override.fatal },
      timestamp: { ...base.timestamp, ...override.timestamp },
      message: { ...base.message, ...override.message }
    };
  }

  static getColorForLevel(level: LogLevel, config: ColorConfig): LevelColorConfig | undefined {
    switch (level) {
      case LogLevel.DEBUG:
        return config.debug;
      case LogLevel.INFO:
        return config.info;
      case LogLevel.WARN:
        return config.warn;
      case LogLevel.ERROR:
        return config.error;
      case LogLevel.FATAL:
        return config.fatal;
      default:
        return undefined;
    }
  }

  static detectEnvironment(): Environment {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      return 'browser';
    }
    
    if (typeof process !== 'undefined' && process.versions && process.versions.node) {
      return 'node';
    }
    
    return 'unknown';
  }
}
