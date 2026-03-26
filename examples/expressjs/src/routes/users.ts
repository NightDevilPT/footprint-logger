import { Router, Request, Response } from 'express';
import { userLogger, UserActionContext } from '../loggers';

const router = Router();

// Mock user data
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    createdAt: new Date('2023-01-01')
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    createdAt: new Date('2023-02-15')
  }
];

// GET /users - Get all users
router.get('/', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  
  userLogger.info('Fetching all users', {
    userId: userId || 'anonymous',
    action: 'view',
    timestamp: new Date(),
    metadata: {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      sessionId: (req as any).sessionId
    }
  });

  res.json({
    success: true,
    data: users,
    count: users.length
  });
});

// GET /users/:id - Get specific user
router.get('/:id', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  const targetUserId = req.params.id;
  
  const user = users.find(u => u.id === targetUserId);
  
  if (!user) {
    userLogger.warn('User not found', {
      userId: userId || 'anonymous',
      action: 'view',
      timestamp: new Date(),
      metadata: { targetUserId, ip: req.ip }
    });
    
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  userLogger.info('User retrieved successfully', {
    userId: userId || 'anonymous',
    action: 'view',
    timestamp: new Date(),
    metadata: { targetUserId, ip: req.ip }
  });
  
  res.json({
    success: true,
    data: user
  });
});

// POST /users - Create new user
router.post('/', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  const { name, email, role = 'user' } = req.body;
  
  if (!name || !email) {
    userLogger.warn('Invalid user creation request', {
      userId: userId || 'anonymous',
      action: 'create',
      timestamp: new Date(),
      metadata: { name, email, ip: req.ip }
    });
    
    return res.status(400).json({
      success: false,
      error: 'Name and email are required'
    });
  }
  
  const newUser: User = {
    id: (users.length + 1).toString(),
    name,
    email,
    role,
    createdAt: new Date()
  };
  
  users.push(newUser);
  
  userLogger.info('User created successfully', {
    userId: userId || 'anonymous',
    action: 'create',
    timestamp: new Date(),
    metadata: { 
      newUserId: newUser.id,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }
  });
  
  res.status(201).json({
    success: true,
    data: newUser
  });
});

// PUT /users/:id - Update user
router.put('/:id', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  const targetUserId = req.params.id;
  const { name, email, role } = req.body;
  
  const userIndex = users.findIndex(u => u.id === targetUserId);
  
  if (userIndex === -1) {
    userLogger.error('User not found for update', new Error(`User ${targetUserId} not found`), {
      userId: userId || 'anonymous',
      action: 'update',
      timestamp: new Date(),
      metadata: { targetUserId, ip: req.ip }
    });
    
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  const beforeUser = { ...users[userIndex] };
  
  // Update user
  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;
  if (role) users[userIndex].role = role;
  
  const afterUser = users[userIndex];
  
  userLogger.info('User updated successfully', {
    userId: userId || 'anonymous',
    action: 'update',
    timestamp: new Date(),
    metadata: { 
      targetUserId,
      changes: Object.keys(req.body),
      ip: req.ip
    }
  });
  
  res.json({
    success: true,
    data: afterUser
  });
});

// DELETE /users/:id - Delete user
router.delete('/:id', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  const targetUserId = req.params.id;
  
  const userIndex = users.findIndex(u => u.id === targetUserId);
  
  if (userIndex === -1) {
    userLogger.error('User not found for deletion', new Error(`User ${targetUserId} not found`), {
      userId: userId || 'anonymous',
      action: 'delete',
      timestamp: new Date(),
      metadata: { targetUserId, ip: req.ip }
    });
    
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  const deletedUser = users[userIndex];
  users.splice(userIndex, 1);
  
  userLogger.info('User deleted successfully', {
    userId: userId || 'anonymous',
    action: 'delete',
    timestamp: new Date(),
    metadata: { 
      deletedUserId: targetUserId,
      deletedUserName: deletedUser.name,
      ip: req.ip
    }
  });
  
  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

export default router;
