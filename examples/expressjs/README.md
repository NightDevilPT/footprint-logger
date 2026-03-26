# Express.js TypeScript Example - Universal Logger

This example demonstrates how to use the Universal Logger package in an Express.js TypeScript application with full type safety and custom contexts.

## 🚀 Features Demonstrated

- **Type-Safe Logging**: Custom context types for different parts of the application
- **Request Logging Middleware**: Automatic HTTP request/response logging
- **Error Handling**: Comprehensive error logging with context
- **Multiple Loggers**: Different loggers for different concerns (users, database, requests)
- **Styled Terminal Output**: Beautiful colored logs in the terminal
- **Advanced Console Methods**: `table()`, `group()`, `time()` etc.

## 📁 Project Structure

```
expressjs/
├── src/
│   ├── index.ts              # Main Express app
│   ├── loggers.ts            # Typed logger configurations
│   ├── middleware.ts         # Request/error logging middleware
│   └── routes/
│       ├── users.ts          # User management routes
│       └── database.ts       # Database operation routes
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Build for production:**
```bash
npm run build
npm start
```

## 📊 Logging Examples

### **Request Context Type**
```typescript
interface RequestContext {
  method: string;
  path: string;
  userId?: string;
  correlationId: string;
  userAgent?: string;
  ip?: string;
  statusCode?: number;
  duration?: number;
}
```

### **User Action Context Type**
```typescript
interface UserActionContext {
  userId: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout';
  timestamp: Date;
  metadata?: {
    ip?: string;
    userAgent?: string;
    sessionId?: string;
  };
}
```

### **Database Context Type**
```typescript
interface DatabaseContext {
  operation: 'query' | 'insert' | 'update' | 'delete';
  table: string;
  duration: number;
  recordCount?: number;
  error?: string;
}
```

## 🎯 API Endpoints

### **Health Check**
- `GET /health` - Server health status

### **Demo**
- `GET /api/demo` - Demonstrates all logging features

### **User Management**
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### **Database Operations**
- `GET /api/database/query` - Simulate database query
- `POST /api/database/insert` - Simulate database insert
- `PUT /api/database/update` - Simulate database update
- `DELETE /api/database/delete` - Simulate database delete

## 🧪 Testing the Logger

### **1. Basic Request Logging**
```bash
curl http://localhost:3000/api/users
```

### **2. User Actions**
```bash
# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "x-user-id: user123" \
  -d '{"name": "John Doe", "email": "john@example.com"}'

# Update user
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -H "x-user-id: user123" \
  -d '{"name": "John Updated"}'
```

### **3. Database Operations**
```bash
# Simulate database query
curl http://localhost:3000/api/database/query

# Simulate database insert
curl -X POST http://localhost:3000/api/database/insert
```

### **4. Demo All Features**
```bash
curl http://localhost:3000/api/demo
```

## 📈 Console Output Examples

### **Request Logging**
```
[2024-01-15 10:30:45] INFO  → [express-api] Incoming request {
  "method": "GET",
  "path": "/api/users",
  "correlationId": "abc123",
  "userAgent": "curl/7.68.0",
  "ip": "::1"
}

[2024-01-15 10:30:45] INFO  → [express-api] Request completed successfully {
  "method": "GET",
  "path": "/api/users",
  "correlationId": "abc123",
  "statusCode": 200,
  "duration": 15
}
```

### **User Actions**
```
[2024-01-15 10:30:46] INFO  → [user-service] User created successfully {
  "userId": "user123",
  "action": "create",
  "timestamp": "2024-01-15T10:30:46.123Z",
  "metadata": {
    "newUserId": "3",
    "ip": "::1",
    "userAgent": "curl/7.68.0"
  }
}
```

### **Database Operations (JSON Format)**
```json
{
  "timestamp": "2024-01-15T10:30:47.123Z",
  "level": 20,
  "message": "Database query completed",
  "context": {
    "operation": "query",
    "table": "users",
    "duration": 150,
    "recordCount": 25
  },
  "appName": "database",
  "pid": 12345,
  "hostname": "localhost"
}
```

## 🎨 Styling Features

The Express example uses **Chalk styling** for beautiful terminal output:

- **INFO**: Green bold text
- **WARN**: Yellow bold text  
- **ERROR**: Red bold text
- **DEBUG**: Blue text
- **Timestamp**: Gray text

## 🔧 Configuration

### **Request Logger**
```typescript
const requestLogger = new LoggerBuilder<RequestContext>()
  .setAppName('express-api')
  .useFormat('styled')
  .enableColors(true)
  .setColorConfig({
    info: { color: 'green', bold: true },
    warn: { color: 'yellow', bold: true },
    error: { color: 'red', bold: true },
    debug: { color: 'blue' }
  })
  .enableChangeTracking(true)
  .setBufferSize(100)
  .setFlushInterval(2000)
  .build();
```

### **User Logger**
```typescript
const userLogger = new LoggerBuilder<UserActionContext>()
  .setAppName('user-service')
  .useFormat('styled')
  .enableColors(true)
  .setColorConfig({
    info: { color: 'cyan', bold: true },
    warn: { color: 'orange', bold: true },
    error: { color: 'red', bold: true, underline: true },
    fatal: { color: 'red', bgColor: 'white', bold: true }
  })
  .build();
```

### **Database Logger**
```typescript
const dbLogger = new LoggerBuilder<DatabaseContext>()
  .setAppName('database')
  .useFormat('json')
  .enableColors(false)
  .build();
```

## 🚦 Error Handling

The example includes comprehensive error handling:

- **Request errors**: Logged with full context and correlation ID
- **Database errors**: Logged with operation details and duration
- **Unhandled errors**: Caught by global error middleware
- **Graceful shutdown**: Proper cleanup on SIGTERM/SIGINT

## 📝 Key Takeaways

1. **Type Safety**: Each logger has its own context type
2. **Correlation Tracking**: Requests are tracked across the application
3. **Performance Monitoring**: Request duration and database operation timing
4. **Structured Logging**: JSON format for database logs, styled format for user actions
5. **Middleware Integration**: Seamless Express.js integration
6. **Production Ready**: Error handling, graceful shutdown, buffering

This example showcases the full power of Universal Logger in a real-world Express.js application!
