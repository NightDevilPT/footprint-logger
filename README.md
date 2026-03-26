Here's the updated documentation with the enhanced color customization and styling features:

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Builder Pattern](#-builder-pattern)
- [Custom Components](#-custom-components)
- [Color & Styling](#-color--styling)
- [Change Tracking](#-change-tracking)
- [Framework Integrations](#-framework-integrations)
- [Security Features](#-security-features)
- [Performance](#-performance)
- [API Reference](#-api-reference)

---

## 🚀 Overview

**Universal Logger** is a comprehensive logging solution built with SOLID principles, featuring **Builder Pattern** for flexible configuration and **Factory Pattern** for dynamic component creation. It provides a unified logging experience across multiple frameworks with consistent APIs and production-ready features.

### Core Philosophy

- **Builder Pattern**: Fluent, intuitive, and type-safe configuration
- **Factory Pattern**: Dynamic instantiation of formatters and transports
- **Open/Closed Principle**: Easily extend with custom components
- **Single Responsibility**: Each component has one clear purpose

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🏗️ **Builder Pattern** | Fluent configuration API for easy setup |
| 🏭 **Factory Pattern** | Dynamic formatter & transport instantiation |
| 🎨 **Custom Colors** | Define custom colors for each log level with cross-platform support |
| 📝 **Custom Formatters** | Create your own log formatting logic with custom types |
| 📁 **Custom Transports** | Send logs to any destination (API, DB, etc.) |
| 🔧 **Type-Safe Context** | Define your own types for log context |
| 📊 **Change Tracking** | Track before/after state changes with custom types |
| 🎯 **Framework Agnostic** | Works with React, Next.js, Express, NestJS |
| 🔒 **Security First** | Automatic PII/PCI-DSS compliant masking |
| ⚡ **High Performance** | Async writes, intelligent buffering |
| 🔄 **Log Rotation** | Automatic size/date-based rotation |
| 🛡️ **Error Handling** | Comprehensive error capture |

---

## 🏗️ Project Structure

```
unilogger/
│
├── examples/
│   ├── expressjs (ts)
│   ├── reactjs (ts)
│   ├── nextjs (ts)
│   └── nestjs (ts)
│
├── src/
│   ├── core/
│   │   ├── Logger.ts              # Main logger class
│   │   ├── LoggerBuilder.ts       # Builder pattern for config
│   │   ├── LogEntry.ts            # Log entry structure with change tracking
│   │   │
│   │   ├── formatters/            # Formatter implementations
│   │   │   ├── IFormatter.ts      # Formatter interface
│   │   │   ├── PrettyFormatter.ts # Human-readable format
│   │   │   ├── JsonFormatter.ts   # JSON format
│   │   │   ├── LogfmtFormatter.ts # Logfmt format
│   │   │   ├── StyledFormatter.ts # Styled terminal output with colors
│   │   │   ├── FormatterFactory.ts # Factory for formatters
│   │   │   └── index.ts
│   │   │
│   │   ├── transports/            # Transport implementations
│   │   │   ├── ITransport.ts      # Transport interface
│   │   │   ├── FileTransport.ts   # File output
│   │   │   ├── TerminalTransport.ts # Console output with styling
│   │   │   ├── JsonFileTransport.ts # JSON file output
│   │   │   ├── TransportFactory.ts # Factory for transports
│   │   │   └── index.ts
│   │   │
│   │   ├── styling/               # Styling utilities
│   │   │   ├── IColorStrategy.ts  # Color strategy interface
│   │   │   ├── ChalkStrategy.ts   # Backend/Node.js styling with chalk
│   │   │   ├── CSSStrategy.ts     # Frontend styling with CSS
│   │   │   ├── ColorManager.ts    # Color configuration manager
│   │   │   └── index.ts
│   │   │
│   │   ├── security/              # Security features
│   │   │   ├── IMasker.ts         # Masker interface
│   │   │   ├── MaskingService.ts  # Sensitive data masking
│   │   │   └── Patterns.ts        # Regex patterns
│   │   │
│   │   └── utils/                 # Shared utilities
│   │       ├── fileUtils.ts       # File system utilities
│   │       ├── environment.ts     # Environment detection
│   │       └── validators.ts      # Validation functions
│   │
│   ├── react/                     # React integration
│   │   ├── LoggerProvider.tsx     # React context provider
│   │   ├── useLogger.ts           # React hook
│   │   └── index.ts
│   │
│   ├── express/                   # Express.js integration
│   │   ├── middleware.ts          # Express middleware
│   │   └── index.ts
│   │
│   ├── nestjs/                    # NestJS integration
│   │   ├── LoggerModule.ts        # NestJS module
│   │   ├── LoggerService.ts       # NestJS service
│   │   └── index.ts
│   │
│   └── index.ts                   # Main entry point
│
├── tests/                         # Test suite
├── dist/                          # Built output
└── package.json
```

---

## 📦 Installation

```bash
npm install unilogger chalk
yarn add unilogger chalk
pnpm add unilogger chalk
bun add unilogger chalk
```

> **Note**: `chalk` is optional for backend styling. The library will automatically detect the environment and use the appropriate styling strategy.

---

## 🏗️ Builder Pattern

### Builder Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `setAppName(name)` | `name: string` | Set application name |
| `useTransport(type)` | `type: 'terminal' \| 'file' \| 'json-file'` | Select transport |
| `setCustomTransport(transport)` | `transport: ITransport` | Use custom transport |
| `useFormat(type)` | `type: 'pretty' \| 'json' \| 'logfmt' \| 'styled'` | Select formatter |
| `setCustomFormatter(formatter)` | `formatter: IFormatter` | Use custom formatter |
| `setFilePath(path)` | `path: string` | File path for file transport |
| `enableColors(enable)` | `enable: boolean` | Enable/disable colors |
| `setColorConfig(config)` | `config: ColorConfig` | Set custom colors for log levels |
| `enableMasking(enable)` | `enable: boolean` | Enable data masking |
| `addMaskingPattern(pattern)` | `pattern: MaskingPattern` | Add custom masking pattern |
| `setBufferSize(size)` | `size: number` | Set buffer size (entries) |
| `setFlushInterval(ms)` | `ms: number` | Set flush interval (ms) |
| `setMaxFileSize(bytes)` | `bytes: number` | Max file size before rotation |
| `setMaxFiles(count)` | `count: number` | Max files to retain |
| `setRetentionDays(days)` | `days: number` | Retention period in days |
| `enableCompression(enable)` | `enable: boolean` | Enable gzip compression |
| `enableChangeTracking(enable)` | `enable: boolean` | Enable change tracking |
| `build()` | - | Build and return logger |

---

## 🎨 Color & Styling

Universal Logger provides intelligent, cross-platform color styling that automatically adapts to your environment.

### Color Configuration Interface

```typescript
interface ColorConfig {
  info?: {
    color?: string;      // Text color
    bgColor?: string;    // Background color
    bold?: boolean;      // Bold text
    italic?: boolean;    // Italic text
    underline?: boolean; // Underline text
  };
  debug?: {
    color?: string;
    bgColor?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
  warn?: {
    color?: string;
    bgColor?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
  error?: {
    color?: string;
    bgColor?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
  fatal?: {
    color?: string;
    bgColor?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
  timestamp?: {
    color?: string;
    bold?: boolean;
  };
  message?: {
    color?: string;
  };
}
```

### Default Color Schemes

| Level | Backend (Chalk) | Frontend (CSS) |
|-------|-----------------|----------------|
| **INFO** | `chalk.blue` | `color: #00aaff` |
| **DEBUG** | `chalk.gray` | `color: #888888` |
| **WARN** | `chalk.yellow.bold` | `color: #ffaa00; font-weight: bold` |
| **ERROR** | `chalk.red.bold` | `color: #ff0000; font-weight: bold` |
| **FATAL** | `chalk.red.bgWhite.bold` | `color: #ff0000; background: white; font-weight: bold` |

### Custom Color Configuration

#### Backend/Node.js Example (using Chalk)

```typescript
const logger = new LoggerBuilder()
  .setAppName('my-api')
  .useFormat('styled')
  .enableColors(true)
  .setColorConfig({
    info: {
      color: 'cyan',        // Chalk color name
      bold: true
    },
    warn: {
      color: 'yellow',
      bgColor: 'black',
      bold: true,
      underline: true
    },
    error: {
      color: 'red',
      bgColor: 'white',
      bold: true,
      italic: true
    },
    timestamp: {
      color: 'gray',
      bold: false
    }
  })
  .build();
```

#### Frontend/Browser Example (using CSS)

```typescript
const logger = new LoggerBuilder()
  .setAppName('my-app')
  .useFormat('styled')
  .enableColors(true)
  .setColorConfig({
    info: {
      color: '#00aaff',
      bold: true
    },
    warn: {
      color: '#ffaa00',
      bgColor: '#332200',
      bold: true,
      underline: true
    },
    error: {
      color: '#ff0000',
      bgColor: '#ffcccc',
      bold: true,
      italic: true
    },
    debug: {
      color: '#888888'
    }
  })
  .build();
```

### Advanced Console Methods

The styled formatter supports advanced console methods for better debugging:

```typescript
// Console.table - Display data in tabular format
logger.table('User Data', usersArray);

// Console.group - Group related logs
logger.group('API Request');
logger.info('Endpoint: /api/users');
logger.info('Method: POST');
logger.info('Status: 200');
logger.groupEnd();

// Console.groupCollapsed - Collapsible groups
logger.groupCollapsed('Performance Metrics');
logger.info('Request duration: 245ms');
logger.info('Memory usage: 45MB');
logger.groupEnd();

// Console.time - Time operations
logger.time('Database Query');
// ... database operation
logger.timeEnd('Database Query');

// Console.count - Count occurrences
logger.count('User Login');
logger.count('User Login');
logger.countReset('User Login');

// Console.trace - Stack trace
logger.trace('Function called from');

// Console.dir - Object inspection
logger.dir(complexObject, { depth: 2, colors: true });
```

### Environment Detection

The library automatically detects the runtime environment and applies the appropriate styling strategy:

| Environment | Strategy | Styling Method |
|-------------|----------|----------------|
| **Node.js/Backend** | Chalk Strategy | `chalk.red.bold('message')` |
| **Browser/Client** | CSS Strategy | `console.log('%c message', 'color: red')` |
| **Server Components (Next.js)** | Auto-detection | Switches between strategies |
| **React Native** | CSS-like Strategy | Uses style objects |

### Manual Strategy Selection

You can manually specify the styling strategy:

```typescript
// Force backend styling
const backendLogger = new LoggerBuilder()
  .setEnvironment('node')
  .setColorConfig({ info: { color: 'cyan' } })
  .build();

// Force frontend styling
const frontendLogger = new LoggerBuilder()
  .setEnvironment('browser')
  .setColorConfig({ info: { color: '#00aaff' } })
  .build();
```

### Styled Output Examples

#### Backend Output (using Chalk)
```bash
[2024-01-15 10:30:45] ℹ INFO  → User logged in successfully
[2024-01-15 10:30:46] ⚠ WARN  → Rate limit approaching (85%)
[2024-01-15 10:30:47] ✖ ERROR → Database connection failed
```

#### Frontend Output (using CSS)
![Styled Console Output](https://via.placeholder.com/600x200?text=Styled+Console+Output)

### Creating Custom Color Strategies

```typescript
// Implement your own color strategy
class CustomColorStrategy implements IColorStrategy {
  applyStyle(level: LogLevel, text: string, config?: LevelColorConfig): string {
    // Custom implementation for your framework
    // e.g., using chalk, CSS, or any other styling system
    return styledText;
  }
  
  getEnvironment(): 'node' | 'browser' | 'unknown' {
    return 'node';
  }
}

// Use custom strategy
const logger = new LoggerBuilder()
  .setColorStrategy(new CustomColorStrategy())
  .setColorConfig({ info: { color: 'magenta', bold: true } })
  .build();
```

---

## 🎨 Custom Components

### Custom Formatter with Type-Safe Context

Create custom formatters with your own types for structured logging:

```typescript
// Define your custom context type
interface UserActionContext {
  userId: string;
  action: 'create' | 'update' | 'delete';
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Implement custom formatter
class UserActionFormatter implements IFormatter<UserActionContext> {
  format(entry: ILogEntry<UserActionContext>): string {
    // Your custom formatting logic here
    return `${entry.timestamp} - ${entry.context?.userId} performed ${entry.context?.action}`;
  }
  
  getType(): string {
    return 'user-action';
  }
}

// Use with custom types
const logger = new LoggerBuilder<UserActionContext>()
  .setAppName('user-service')
  .setCustomFormatter(new UserActionFormatter())
  .build();

// Type-safe logging with your context
await logger.info('User action performed', {
  userId: '123',
  action: 'update',
  timestamp: new Date(),
  metadata: { ip: '127.0.0.1' }
});
```

### Custom Transport with Type-Safe Data

Create custom transports that handle your specific data structures:

```typescript
// Define your log data structure
interface APILogData {
  endpoint: string;
  method: string;
  statusCode: number;
  duration: number;
  requestId: string;
}

// Implement custom transport
class APITransport implements ITransport<APILogData> {
  async write(data: APILogData): Promise<void> {
    // Send to your API monitoring service
    await fetch('https://api.monitoring.com/logs', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  async close(): Promise<void> {
    // Cleanup
  }
  
  getType(): string {
    return 'api';
  }
}

// Use with custom transport
const logger = new LoggerBuilder<APILogData>()
  .setAppName('api-gateway')
  .setCustomTransport(new APITransport())
  .useFormat('json')
  .build();
```

### Generic Custom Formatter

Create reusable formatters that work with any type:

```typescript
// Generic formatter for any context type
class PrettyFormatter<T> implements IFormatter<T> {
  format(entry: ILogEntry<T>): string {
    return `[${entry.timestamp}] ${entry.message} ${JSON.stringify(entry.context)}`;
  }
  
  getType(): string {
    return 'pretty-generic';
  }
}

// Use with different types
interface OrderContext {
  orderId: string;
  amount: number;
  currency: string;
}

interface PaymentContext {
  transactionId: string;
  paymentMethod: string;
  status: 'success' | 'failed';
}

const orderLogger = new LoggerBuilder<OrderContext>()
  .setAppName('order-service')
  .setCustomFormatter(new PrettyFormatter<OrderContext>())
  .build();

const paymentLogger = new LoggerBuilder<PaymentContext>()
  .setAppName('payment-service')
  .setCustomFormatter(new PrettyFormatter<PaymentContext>())
  .build();
```

---

## 📊 Change Tracking with Custom Types

Track state changes with your own types:

```typescript
// Define your entity types
interface UserEntity {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// Track changes with type safety
const before: UserEntity = {
  id: '123',
  name: 'John Doe',
  email: 'john@old.com',
  role: 'user'
};

const after: UserEntity = {
  id: '123',
  name: 'John Doe',
  email: 'john@new.com',
  role: 'admin'
};

const change = await logger.logChange<UserEntity>(
  'User updated',
  before,
  after,
  { updatedBy: 'system' }
);
```

---

## ⚛️ Framework Integrations with Custom Types

### React with Custom Types and Styling

```typescript
// Define your app-specific log context
interface AppLogContext {
  component: string;
  userId?: string;
  action?: string;
}

// Create typed hook
const { logger } = useLogger<AppLogContext>();

// Type-safe logging with automatic client-side styling
logger.info('Component mounted', {
  component: 'UserProfile',
  userId: '123'
});

// Advanced console methods in browser
logger.table('User Data', users);
logger.group('API Call');
logger.time('Request');
```

### Express with Custom Types and Terminal Styling

```typescript
// Define request log context
interface RequestContext {
  method: string;
  path: string;
  userId?: string;
  correlationId: string;
}

const logger = new LoggerBuilder<RequestContext>()
  .setAppName('api')
  .useFormat('styled')
  .setColorConfig({
    info: { color: 'green', bold: true },
    warn: { color: 'yellow', bold: true },
    error: { color: 'red', bold: true }
  })
  .build();

app.use((req, res, next) => {
  logger.info('Request received', {
    method: req.method,
    path: req.path,
    correlationId: req.headers['x-correlation-id'] as string
  });
  next();
});
```

### Next.js with Mixed Environment Support

```typescript
// This works in both server and client components
const logger = new LoggerBuilder()
  .setAppName('next-app')
  .useFormat('styled')
  .enableColors(true)
  .setColorConfig({
    info: { color: 'blue' },
    warn: { color: 'orange', bold: true },
    error: { color: 'red', bold: true }
  })
  .build();

// Server Component (uses chalk)
export default async function ServerComponent() {
  logger.info('Rendering on server');
  return <div>Content</div>;
}

// Client Component (uses CSS styling)
'use client';
export function ClientComponent() {
  const { logger } = useLogger();
  
  useEffect(() => {
    logger.info('Mounted on client');
    logger.table('Props', { name: 'value' });
  }, []);
  
  return <div>Content</div>;
}
```

### NestJS with Custom Types

```typescript
// Define module-specific context
interface UserModuleContext {
  module: 'users';
  operation: 'create' | 'find' | 'update';
  userId?: string;
}

@Injectable()
class UsersService {
  constructor(private logger: Logger<UserModuleContext>) {}
  
  async createUser(data: any) {
    this.logger.info('Creating user', {
      module: 'users',
      operation: 'create'
    });
  }
}
```

---

## 🔒 Security Features

### Automatic Masking

Built-in patterns for sensitive data:
- Passwords, tokens, API keys
- Credit card numbers
- Social security numbers
- Email addresses (partial masking)
- Authorization headers

### Custom Masking with Types

```typescript
// Define sensitive data types
interface SensitiveData {
  password: string;
  ssn: string;
  creditCard: string;
}

const logger = new LoggerBuilder<SensitiveData>()
  .enableMasking(true)
  .addMaskingPattern({
    pattern: /password=\w+/gi,
    replacement: 'password=***'
  })
  .addMaskingPattern({
    pattern: /ssn=\d{3}-\d{2}-\d{4}/gi,
    replacement: 'ssn=***-**-****'
  })
  .build();
```

---

## ⚡ Performance Optimizations

| Feature | Description |
|---------|-------------|
| **Async Writes** | Non-blocking I/O operations |
| **Buffering** | In-memory buffer before flush |
| **Configurable Queue** | Block, drop, or flush on overflow |
| **Log Rotation** | Automatic size/date-based rotation |
| **Compression** | Optional gzip compression for rotated logs |
| **Retention** | Automatic cleanup of old log files |

---

## 📚 API Reference

### Logger Class with Generics

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `info<T>(message, context?)` | `message: string, context?: T` | `Promise<ILogChange<T> \| void>` | Log info level |
| `debug<T>(message, context?)` | `message: string, context?: T` | `Promise<ILogChange<T> \| void>` | Log debug level |
| `warn<T>(message, context?)` | `message: string, context?: T` | `Promise<ILogChange<T> \| void>` | Log warning level |
| `error<T>(message, error?, context?)` | `message: string, error?: Error, context?: T` | `Promise<ILogChange<T> \| void>` | Log error level |
| `fatal<T>(message, error?, context?)` | `message: string, error?: Error, context?: T` | `Promise<ILogChange<T> \| void>` | Log fatal level |
| `table<T>(title, data)` | `title: string, data: T[] \| object` | `void` | Display data in table format |
| `group(title, fn?)` | `title: string, fn?: () => void` | `void` | Group related logs |
| `groupCollapsed(title, fn?)` | `title: string, fn?: () => void` | `void` | Create collapsible group |
| `groupEnd()` | - | `void` | End current group |
| `time(label)` | `label: string` | `void` | Start timer |
| `timeEnd(label)` | `label: string` | `void` | End timer and log duration |
| `count(label)` | `label: string` | `void` | Increment and log counter |
| `countReset(label)` | `label: string` | `void` | Reset counter |
| `trace(message, ...args)` | `message: string, ...args: any[]` | `void` | Log with stack trace |
| `dir(obj, options?)` | `obj: any, options?: any` | `void` | Inspect object |
| `logChange<T>(message, before, after, context?)` | `message: string, before: T, after: T, context?: object` | `Promise<ILogChange<T>>` | Log state change |
| `batch<T>(entries)` | `entries: BatchEntry<T>[]` | `Promise<void>` | Log multiple entries |
| `flush()` | - | `Promise<void>` | Flush buffered logs |
| `shutdown()` | - | `Promise<void>` | Graceful shutdown |

### IFormatter Interface with Generics

| Method | Returns | Description |
|--------|---------|-------------|
| `format<T>(entry: ILogEntry<T>)` | `string` | Format log entry with generic context |
| `getType()` | `string` | Get formatter type |

### ITransport Interface with Generics

| Method | Returns | Description |
|--------|---------|-------------|
| `write<T>(data: T)` | `Promise<void>` | Write typed log data |
| `close()` | `Promise<void>` | Close transport |
| `getType()` | `string` | Get transport type |

### ILogEntry Interface with Generics

| Property | Type | Description |
|----------|------|-------------|
| `timestamp` | `Date` | Log timestamp |
| `level` | `LogLevel` | Log level |
| `message` | `string` | Log message |
| `context` | `T` | Type-safe context data |
| `error` | `Error?` | Error object |
| `pid` | `number` | Process ID |
| `hostname` | `string` | Hostname |
| `appName` | `string?` | Application name |
| `correlationId` | `string?` | Correlation ID |

### Log Levels

| Level | Priority | Description |
|-------|----------|-------------|
| `DEBUG` | 10 | Detailed debugging information |
| `INFO` | 20 | General application events |
| `WARN` | 30 | Warning conditions |
| `ERROR` | 40 | Error conditions requiring attention |
| `FATAL` | 50 | Critical errors causing termination |

### Output Formats

| Format | Description | Best For |
|--------|-------------|---------|
| **Pretty** | Human-readable with colors | Development |
| **Styled** | Enhanced terminal/browser styling with custom colors | Production & Development |
| **JSON** | Structured format | Production log aggregators |
| **Logfmt** | Key-value format | Grep-friendly operations |

### Transports

| Transport | Description |
|-----------|-------------|
| **Terminal** | Console output with intelligent styling (chalk/CSS) |
| **File** | Plain text file output |
| **JSON File** | Structured JSON file output |

---

## 📄 License

MIT © NightDevilPT

---

<div align="center">
  <sub>Built with ❤️ using Builder & Factory Patterns with full TypeScript generic support and intelligent cross-platform styling</sub>
</div>
```

### Key Additions & Changes:

1. **New Styling Section** - Complete documentation for color customization
2. **ColorConfig Interface** - Type-safe color configuration structure
3. **Cross-Platform Support** - Automatic detection and switching between Chalk (backend) and CSS (frontend)
4. **Advanced Console Methods** - Support for `table()`, `group()`, `time()`, `count()`, `trace()`, `dir()`
5. **Styled Formatter** - New formatter type that supports custom colors and styles
6. **Environment Detection** - Automatic detection of Node.js vs browser environment
7. **Custom Color Strategies** - Ability to implement custom styling strategies
8. **Next.js Server/Client Support** - Automatic handling of mixed environments
9. **Color Strategy Architecture** - New styling directory with strategy pattern implementation
10. **Updated Examples** - Real-world examples for both backend and frontend styling