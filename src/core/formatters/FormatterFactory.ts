import { IFormatter, FormatterType } from '../types';
import { PrettyFormatter } from '../formatters/PrettyFormatter';
import { JsonFormatter } from '../formatters/JsonFormatter';
import { LogfmtFormatter } from '../formatters/LogfmtFormatter';
import { StyledFormatter } from '../formatters/StyledFormatter';
import { ColorManager } from '../styling/IColorStrategy';

export class FormatterFactory {
  static create<T = any>(
    type: FormatterType,
    colorConfig?: any,
    environment?: 'node' | 'browser' | 'unknown'
  ): IFormatter<T> {
    const config = colorConfig || ColorManager.getDefaultColors();
    const env = environment || ColorManager.detectEnvironment();

    switch (type) {
      case 'pretty':
        return new PrettyFormatter<T>();
      case 'json':
        return new JsonFormatter<T>();
      case 'logfmt':
        return new LogfmtFormatter<T>();
      case 'styled':
        return new StyledFormatter<T>(config, env);
      default:
        return new PrettyFormatter<T>();
    }
  }

  static registerCustomFormatter<T = any>(
    type: string,
    formatterClass: new (...args: any[]) => IFormatter<T>
  ): void {
    (FormatterFactory as any).customFormatters = (FormatterFactory as any).customFormatters || {};
    (FormatterFactory as any).customFormatters[type] = formatterClass;
  }

  static createCustom<T = any>(type: string, ...args: any[]): IFormatter<T> | null {
    const customFormatters = (FormatterFactory as any).customFormatters;
    if (customFormatters && customFormatters[type]) {
      return new customFormatters[type](...args);
    }
    return null;
  }
}
