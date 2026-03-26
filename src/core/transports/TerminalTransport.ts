import { ITransport } from '../types';

export class TerminalTransport<T = any> implements ITransport<T> {
  async write(data: T): Promise<void> {
    if (Array.isArray(data)) {
      // Handle browser console styling with CSS arguments
      console.log(...data);
    } else if (typeof data === 'string') {
      console.log(data);
    } else {
      console.log(data);
    }
  }

  async close(): Promise<void> {
    // No cleanup needed for console transport
  }

  getType(): string {
    return 'terminal';
  }
}
