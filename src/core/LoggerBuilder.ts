import { 
  LoggerConfig, 
  TransportType, 
  FormatterType, 
  ITransport, 
  IFormatter, 
  ColorConfig, 
  MaskingPattern,
  Environment
} from './types';
import { Logger } from './Logger';
import { ColorManager } from './styling';

export class LoggerBuilder<T = any> {
  private config: LoggerConfig = {};

  setAppName(name: string): LoggerBuilder<T> {
    this.config.appName = name;
    return this;
  }

  useTransport(type: TransportType): LoggerBuilder<T> {
    this.config.transport = type;
    return this;
  }

  setCustomTransport(transport: ITransport): LoggerBuilder<T> {
    this.config.customTransport = transport;
    return this;
  }

  useFormat(type: FormatterType): LoggerBuilder<T> {
    this.config.formatter = type;
    return this;
  }

  setCustomFormatter(formatter: IFormatter): LoggerBuilder<T> {
    this.config.customFormatter = formatter;
    return this;
  }

  setFilePath(path: string): LoggerBuilder<T> {
    this.config.filePath = path;
    return this;
  }

  enableColors(enable: boolean): LoggerBuilder<T> {
    this.config.enableColors = enable;
    return this;
  }

  setColorConfig(config: ColorConfig): LoggerBuilder<T> {
    this.config.colorConfig = config;
    return this;
  }

  enableMasking(enable: boolean): LoggerBuilder<T> {
    this.config.enableMasking = enable;
    return this;
  }

  addMaskingPattern(pattern: MaskingPattern): LoggerBuilder<T> {
    if (!this.config.maskingPatterns) {
      this.config.maskingPatterns = [];
    }
    this.config.maskingPatterns.push(pattern);
    return this;
  }

  setBufferSize(size: number): LoggerBuilder<T> {
    this.config.bufferSize = size;
    return this;
  }

  setFlushInterval(ms: number): LoggerBuilder<T> {
    this.config.flushInterval = ms;
    return this;
  }

  setMaxFileSize(bytes: number): LoggerBuilder<T> {
    this.config.maxFileSize = bytes;
    return this;
  }

  setMaxFiles(count: number): LoggerBuilder<T> {
    this.config.maxFiles = count;
    return this;
  }

  setRetentionDays(days: number): LoggerBuilder<T> {
    this.config.retentionDays = days;
    return this;
  }

  enableCompression(enable: boolean): LoggerBuilder<T> {
    this.config.enableCompression = enable;
    return this;
  }

  enableChangeTracking(enable: boolean): LoggerBuilder<T> {
    this.config.enableChangeTracking = enable;
    return this;
  }

  setEnvironment(env: Environment): LoggerBuilder<T> {
    this.config.environment = env;
    return this;
  }

  build(): Logger<T> {
    return new Logger<T>(this.config);
  }
}
