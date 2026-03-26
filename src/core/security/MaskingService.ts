import { MaskingPattern } from '../types';

export interface IMasker {
  mask(text: string): string;
  addPattern(pattern: MaskingPattern): void;
  removePattern(description: string): void;
}

export class MaskingService implements IMasker {
  private patterns: MaskingPattern[] = [];

  constructor() {
    this.initializeDefaultPatterns();
  }

  mask(text: string): string {
    let maskedText = text;
    
    for (const pattern of this.patterns) {
      maskedText = maskedText.replace(pattern.pattern, pattern.replacement);
    }
    
    return maskedText;
  }

  addPattern(pattern: MaskingPattern): void {
    this.patterns.push(pattern);
  }

  removePattern(description: string): void {
    this.patterns = this.patterns.filter(p => p.description !== description);
  }

  getPatterns(): MaskingPattern[] {
    return [...this.patterns];
  }

  clearPatterns(): void {
    this.patterns = [];
  }

  private initializeDefaultPatterns(): void {
    // Password masking
    this.patterns.push({
      pattern: /password["\s]*[:=]["\s]*([^"\s,}]+)/gi,
      replacement: 'password"***"',
      description: 'password'
    });

    // API Key masking
    this.patterns.push({
      pattern: /api[_-]?key["\s]*[:=]["\s]*([^"\s,}]+)/gi,
      replacement: 'api_key"***"',
      description: 'api_key'
    });

    // Token masking
    this.patterns.push({
      pattern: /token["\s]*[:=]["\s]*([^"\s,}]+)/gi,
      replacement: 'token"***"',
      description: 'token'
    });

    // Credit card masking
    this.patterns.push({
      pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
      replacement: '****-****-****-****',
      description: 'credit_card'
    });

    // SSN masking
    this.patterns.push({
      pattern: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g,
      replacement: '***-**-****',
      description: 'ssn'
    });

    // Email masking (partial)
    this.patterns.push({
      pattern: /\b([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g,
      replacement: '***@***.***',
      description: 'email'
    });

    // Authorization header masking
    this.patterns.push({
      pattern: /authorization["\s]*[:=]["\s]*([^"\s,}]+)/gi,
      replacement: 'authorization"***"',
      description: 'authorization'
    });

    // Bearer token masking
    this.patterns.push({
      pattern: /bearer\s+([a-zA-Z0-9._-]+)/gi,
      replacement: 'bearer ***',
      description: 'bearer_token'
    });
  }
}
