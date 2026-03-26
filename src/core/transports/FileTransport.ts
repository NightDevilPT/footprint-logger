import { ITransport } from '../types';
import { writeFileSync, appendFileSync, existsSync } from 'fs';
import { dirname } from 'path';
import { mkdirSync } from 'fs';

export class FileTransport<T = any> implements ITransport<T> {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.ensureDirectoryExists();
  }

  async write(data: T): Promise<void> {
    const content = typeof data === 'string' ? data : JSON.stringify(data);
    
    try {
      if (existsSync(this.filePath)) {
        appendFileSync(this.filePath, content + '\n');
      } else {
        writeFileSync(this.filePath, content + '\n');
      }
    } catch (error) {
      console.error('Failed to write to file:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    // No cleanup needed for basic file transport
  }

  getType(): string {
    return 'file';
  }

  private ensureDirectoryExists(): void {
    try {
      const dir = dirname(this.filePath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    } catch (error) {
      console.error('Failed to create directory:', error);
    }
  }
}
