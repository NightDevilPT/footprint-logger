import { IColorStrategy } from './IColorStrategy';
import { LogLevel, Environment, LevelColorConfig } from '../types';

export class CSSStrategy implements IColorStrategy {
  applyStyle(level: LogLevel, text: string, config?: LevelColorConfig): string {
    if (!config) {
      return text;
    }

    const styles: string[] = [];

    if (config.color) {
      styles.push(`color: ${config.color}`);
    }

    if (config.bgColor) {
      styles.push(`background-color: ${config.bgColor}`);
    }

    if (config.bold) {
      styles.push('font-weight: bold');
    }

    if (config.italic) {
      styles.push('font-style: italic');
    }

    if (config.underline) {
      styles.push('text-decoration: underline');
    }

    const cssString = styles.length > 0 ? styles.join('; ') : '';
    return text; // For applyStyle, just return text - styling is handled by createConsoleArguments
  }

  getEnvironment(): Environment {
    return 'browser';
  }

  static createConsoleArguments(text: string, config?: LevelColorConfig): any[] {
    if (!config) {
      return [text];
    }

    const styles: string[] = [];

    if (config.color) {
      styles.push(`color: ${config.color}`);
    }

    if (config.bgColor) {
      styles.push(`background-color: ${config.bgColor}`);
    }

    if (config.bold) {
      styles.push('font-weight: bold');
    }

    if (config.italic) {
      styles.push('font-style: italic');
    }

    if (config.underline) {
      styles.push('text-decoration: underline');
    }

    const cssString = styles.length > 0 ? styles.join('; ') : '';
    return [`%c${text}`, cssString];
  }
}
