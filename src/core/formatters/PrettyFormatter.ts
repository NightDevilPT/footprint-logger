import { IFormatter, ILogEntry, LogLevel } from '../types';
import { format } from 'date-fns';

export class PrettyFormatter<T = any> implements IFormatter<T> {
  format(entry: ILogEntry<T>): string {
    const timestamp = format(entry.timestamp, 'yyyy-MM-dd HH:mm:ss');
    const level = LogLevel[entry.level].padEnd(5);
    const appName = entry.appName ? `[${entry.appName}] ` : '';
    const context = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
    const error = entry.error ? `\nError: ${entry.error.message}` : '';
    
    return `${timestamp} ${level} ${appName}${entry.message}${context}${error}`;
  }

  getType(): string {
    return 'pretty';
  }
}
