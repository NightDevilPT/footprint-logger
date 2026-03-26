import { IFormatter, ILogEntry, LogLevel } from '../types';
import { format } from 'date-fns';
import { ColorManager } from '../styling/IColorStrategy';
import { ChalkStrategy } from '../styling/ChalkStrategy';
import { CSSStrategy } from '../styling/CSSStrategy';

export class StyledFormatter<T = any> implements IFormatter<T> {
  private colorStrategy: any;
  private colorConfig: any;

  constructor(colorConfig?: any, environment?: 'node' | 'browser' | 'unknown') {
    this.colorConfig = colorConfig || ColorManager.getDefaultColors();
    
    const env = environment || ColorManager.detectEnvironment();
    this.colorStrategy = env === 'node' ? new ChalkStrategy() : new CSSStrategy();
  }

  format(entry: ILogEntry<T>): string | any[] {
    const timestamp = format(entry.timestamp, 'yyyy-MM-dd HH:mm:ss');
    const level = LogLevel[entry.level];
    const appName = entry.appName ? `[${entry.appName}] ` : '';
    const context = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
    const error = entry.error ? `\nError: ${entry.error.message}` : '';

    const timestampConfig = this.colorConfig.timestamp;
    const levelConfig = ColorManager.getColorForLevel(entry.level, this.colorConfig);
    const messageConfig = this.colorConfig.message;

    if (this.colorStrategy.getEnvironment() === 'browser') {
      const styledTimestamp = CSSStrategy.createConsoleArguments(timestamp, timestampConfig);
      const styledLevel = CSSStrategy.createConsoleArguments(level, levelConfig);
      const styledMessage = CSSStrategy.createConsoleArguments(`${appName}${entry.message}${context}${error}`, messageConfig);
      
      // Return array with message and CSS styles for browser console
      return [
        `${styledTimestamp[0]} ${styledLevel[0]} → ${styledMessage[0]}`,
        styledTimestamp[1] || '',
        styledLevel[1] || '',
        styledMessage[1] || ''
      ];
    } else {
      const styledTimestamp = this.colorStrategy.applyStyle(entry.level, timestamp, timestampConfig);
      const styledLevel = this.colorStrategy.applyStyle(entry.level, level, levelConfig);
      const styledMessage = this.colorStrategy.applyStyle(entry.level, `${appName}${entry.message}${context}${error}`, messageConfig);
      
      // Return string for Node.js environment
      return `[${styledTimestamp}] ${styledLevel.padEnd(5)} → ${styledMessage}`;
    }
  }

  getType(): string {
    return 'styled';
  }
}
