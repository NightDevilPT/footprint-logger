import { ITransport, TransportType } from '../types';
import { TerminalTransport } from '../transports/TerminalTransport';
import { FileTransport } from '../transports/FileTransport';
import { JsonFileTransport } from '../transports/JsonFileTransport';

export class TransportFactory {
  static create<T = any>(type: TransportType, filePath?: string): ITransport<T> {
    const defaultPath = filePath || './logs/app.log';

    switch (type) {
      case 'terminal':
        return new TerminalTransport<T>();
      case 'file':
        return new FileTransport<T>(defaultPath);
      case 'json-file':
        return new JsonFileTransport<T>(defaultPath);
      default:
        return new TerminalTransport<T>();
    }
  }

  static registerCustomTransport<T = any>(
    type: string,
    transportClass: new (...args: any[]) => ITransport<T>
  ): void {
    (TransportFactory as any).customTransports = (TransportFactory as any).customTransports || {};
    (TransportFactory as any).customTransports[type] = transportClass;
  }

  static createCustom<T = any>(type: string, ...args: any[]): ITransport<T> | null {
    const customTransports = (TransportFactory as any).customTransports;
    if (customTransports && customTransports[type]) {
      return new customTransports[type](...args);
    }
    return null;
  }
}
