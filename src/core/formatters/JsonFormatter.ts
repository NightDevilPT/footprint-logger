import { IFormatter, ILogEntry } from '../types';
import { stringify } from 'safe-stable-stringify';
import { LogEntry } from '../LogEntry';

export class JsonFormatter<T = any> implements IFormatter<T> {
  format(entry: ILogEntry<T>): string {
    const logEntry = entry as LogEntry<T>;
    return stringify(logEntry.toJSON());
  }

  getType(): string {
    return 'json';
  }
}
