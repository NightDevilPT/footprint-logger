import { IFormatter, ILogEntry, LogLevel } from '../types';
import { format } from 'date-fns';

export class LogfmtFormatter<T = any> implements IFormatter<T> {
  format(entry: ILogEntry<T>): string {
    const parts: string[] = [];
    
    parts.push(`timestamp=${format(entry.timestamp, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")}`);
    parts.push(`level=${LogLevel[entry.level].toLowerCase()}`);
    parts.push(`message="${entry.message}"`);
    
    if (entry.appName) {
      parts.push(`app=${entry.appName}`);
    }
    
    if (entry.pid) {
      parts.push(`pid=${entry.pid}`);
    }
    
    if (entry.hostname) {
      parts.push(`host=${entry.hostname}`);
    }
    
    if (entry.correlationId) {
      parts.push(`correlation_id=${entry.correlationId}`);
    }
    
    if (entry.context) {
      Object.entries(entry.context as any).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const strValue = typeof value === 'string' ? `"${value}"` : String(value);
          parts.push(`${key}=${strValue}`);
        }
      });
    }
    
    if (entry.error) {
      parts.push(`error="${entry.error.message}"`);
      if (entry.error.stack) {
        parts.push(`stack="${entry.error.stack.replace(/\n/g, '\\n')}"`);
      }
    }
    
    return parts.join(' ');
  }

  getType(): string {
    return 'logfmt';
  }
}
