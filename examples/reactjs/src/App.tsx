import { useEffect, useState } from 'react'
import { LoggerProvider, useLogger } from 'unilogger/react'
import './App.css'

// Define your custom context types
interface UserActionContext {
  userId: string;
  action: 'create' | 'update' | 'delete' | 'view';
  timestamp: Date;
  metadata?: {
    ip?: string;
    userAgent?: string;
    sessionId?: string;
  };
}

interface ComponentStateContext {
  component: string;
  state: Record<string, any>;
  props: Record<string, any>;
  renderCount: number;
}

// User Profile Component with typed logging
function UserProfile({ userId }: { userId: string }) {
  const { logger: userLogger } = useLogger<UserActionContext>('UserProfile');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    userLogger.info('User profile component loaded', {
      userId,
      action: 'view',
      timestamp: new Date(),
      metadata: { sessionId: 'sess_123' }
    });
  }, [userId, userLogger]);

  const handleUpdateUser = async (userData: any) => {
    setLoading(true);
    userLogger.info('Starting user update', {
      userId,
      action: 'update',
      timestamp: new Date(),
      metadata: { ip: '192.168.1.1' }
    });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(userData);
      
      userLogger.info('User updated successfully', {
        userId,
        action: 'update',
        timestamp: new Date()
      });
    } catch (error) {
      userLogger.error('Failed to update user', error as Error, {
        userId,
        action: 'update',
        timestamp: new Date()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <p>User ID: {userId}</p>
      <button onClick={() => handleUpdateUser({ name: 'John Doe' })} disabled={loading}>
        {loading ? 'Updating...' : 'Update User'}
      </button>
    </div>
  );
}

// Analytics Dashboard with typed logging
function AnalyticsDashboard() {
  const { logger: analyticsLogger } = useLogger<ComponentStateContext>('AnalyticsDashboard');
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});

  analyticsLogger.debug('Analytics dashboard rendering', {
    component: 'AnalyticsDashboard',
    state: { dataCount: data.length },
    props: { filters },
    renderCount: 1
  });

  const handleFilterChange = (newFilters: any) => {
    analyticsLogger.info('Filters changed', {
      component: 'AnalyticsDashboard',
      state: { previousFilters: filters, newFilters },
      props: { filters: newFilters },
      renderCount: 1
    });

    setFilters(newFilters);
  };

  return (
    <div className="analytics-dashboard">
      <h2>Analytics Dashboard</h2>
      <div className="filters">
        <button onClick={() => handleFilterChange({ date: 'today' })}>
          Today
        </button>
        <button onClick={() => handleFilterChange({ date: 'week' })}>
          This Week
        </button>
      </div>
      
      <div className="data-display">
        <p>Showing {data.length} results</p>
      </div>
    </div>
  );
}

// App Component demonstrating different logging types
function App() {
  const { logger: appLogger } = useLogger<{ feature: string; version: string }>('App');

  appLogger.info('Application started', {
    feature: 'startup',
    version: '1.0.0'
  });

  // Advanced console methods demo
  const demonstrateConsoleMethods = () => {
    appLogger.table('User Data', [
      { id: 1, name: 'John', role: 'admin' },
      { id: 2, name: 'Jane', role: 'user' }
    ]);

    appLogger.group('API Requests');
    appLogger.time('Database Query');
    setTimeout(() => {
      appLogger.timeEnd('Database Query');
      appLogger.groupEnd();
    }, 1000);

    appLogger.count('Button Click');
    appLogger.trace('Function called from demonstrateConsoleMethods');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Universal Logger - React Demo</h1>
        <p>Demonstrating type-safe logging with custom contexts</p>
      </header>

      <main className="app-main">
        <section className="demo-section">
          <h2>User Management</h2>
          <UserProfile userId="user_123" />
        </section>

        <section className="demo-section">
          <h2>Analytics</h2>
          <AnalyticsDashboard />
        </section>

        <section className="demo-section">
          <h2>Console Methods Demo</h2>
          <button onClick={demonstrateConsoleMethods}>
            Test Console Methods
          </button>
        </section>
      </main>
    </div>
  );
}

// Root App with LoggerProvider
function RootApp() {
  return (
    <LoggerProvider 
      config={{
        appName: 'react-demo-app',
        enableColors: true,
        enableChangeTracking: true,
        bufferSize: 50,
        flushInterval: 3000
      }}
    >
      <App />
    </LoggerProvider>
  );
}

export default RootApp;
