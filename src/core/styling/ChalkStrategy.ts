import { IColorStrategy } from './IColorStrategy';
import { LogLevel, Environment, LevelColorConfig } from '../types';

export class ChalkStrategy implements IColorStrategy {
  private chalk: any;

  constructor() {
    try {
      // For Chalk v5+, we need to handle it differently
      const chalkModule = require('chalk');
      
      // Check if it's Chalk v5+ (ESM module) or v4
      if (chalkModule.default) {
        // Chalk v5+ - use default export
        this.chalk = chalkModule.default;
      } else {
        // Chalk v4 or earlier
        this.chalk = chalkModule;
      }

      // Verify chalk is working
      if (!this.chalk || typeof this.chalk.blue !== 'function') {
        console.warn('Chalk not working properly, falling back to plain text');
        this.chalk = null;
      }
    } catch (error) {
      console.warn('Chalk not available, falling back to plain text');
      this.chalk = null;
    }
  }

  applyStyle(level: LogLevel, text: string, config?: LevelColorConfig): string {
    if (!this.chalk || !config) {
      return text;
    }

    try {
      let styledText = text;

      // Apply color if specified
      if (config.color && this.chalk[config.color]) {
        styledText = this.chalk[config.color](styledText);
      }

      // Apply background color if specified
      if (config.bgColor) {
        const bgMethod = `bg${config.bgColor.charAt(0).toUpperCase() + config.bgColor.slice(1)}`;
        if (this.chalk[bgMethod]) {
          styledText = this.chalk[bgMethod](styledText);
        }
      }

      // Apply text styles
      if (config.bold && this.chalk.bold) {
        styledText = this.chalk.bold(styledText);
      }

      if (config.italic && this.chalk.italic) {
        styledText = this.chalk.italic(styledText);
      }

      if (config.underline && this.chalk.underline) {
        styledText = this.chalk.underline(styledText);
      }

      return styledText;
    } catch (error) {
      console.warn('Error applying chalk styles:', error);
      return text;
    }
  }

  getEnvironment(): Environment {
    return 'node';
  }
}
