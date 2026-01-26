export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  workflow?: Workflow;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  result?: any;
  error?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  createdAt: Date;
  updatedAt: Date;
  isTemplate: boolean;
}

export interface WorkflowStep {
  id: string;
  type: string;
  operation: string;
  parameters: Record<string, any>;
  order: number;
  retryOnFailure: boolean;
  maxRetries: number;
  validateAfter: boolean;
}

export interface OperationMetric {
  operation: string;
  timestamp: number;
  success: boolean;
  durationMs: number;
  errorMessage?: string;
}

export interface SystemStatus {
  connection: 'healthy' | 'unhealthy' | 'unknown';
  pageUrl?: string;
  pageTitle?: string;
  errorCount: number;
  lastCheck: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  avatar?: string;
}

export interface Settings {
  theme: 'light' | 'dark' | 'auto';
  autoRetry: boolean;
  maxRetries: number;
  defaultTimeout: number;
  enableAnalytics: boolean;
  enableAI: boolean;
  notifications: {
    taskComplete: boolean;
    taskFailed: boolean;
    systemAlerts: boolean;
  };
}
