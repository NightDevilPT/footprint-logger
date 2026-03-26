import { ITransport } from '../types';
import { writeFileSync, appendFileSync, existsSync } from 'fs';
import { dirname } from 'path';
import { mkdirSync } from 'fs';
import { stringify } from 'safe-stable-stringify';

export class JsonFileTransport<T = any> implements ITransport<T> {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.ensureDirectoryExists();
  }

  async write(data: T): Promise<void> {
    const jsonContent = typeof data === 'string' ? data : stringify(data);
    
    try {
      if (existsSync(this.filePath)) {
        appendFileSync(this.filePath, jsonContent + '\n');
      } else {
        writeFileSync(this.filePath, jsonContent + '\n');
      }
    } catch (error) {
      console.error('Failed to write to JSON file:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    // No cleanup needed for basic JSON file transport
  }

  getType(): string {
    return 'json-file';
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
