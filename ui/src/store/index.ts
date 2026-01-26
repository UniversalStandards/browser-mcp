import { create } from 'zustand';
import type { Task, Workflow, SystemStatus, Settings, OperationMetric } from '../types';

interface AppState {
  tasks: Task[];
  workflows: Workflow[];
  metrics: OperationMetric[];
  systemStatus: SystemStatus;
  settings: Settings;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Workflow actions
  addWorkflow: (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;
  
  // Metrics actions
  addMetric: (metric: OperationMetric) => void;
  clearMetrics: () => void;
  
  // System status
  updateSystemStatus: (status: Partial<SystemStatus>) => void;
  
  // Settings
  updateSettings: (settings: Partial<Settings>) => void;
}

export const useStore = create<AppState>((set) => ({
  tasks: [],
  workflows: [],
  metrics: [],
  systemStatus: {
    connection: 'unknown',
    errorCount: 0,
    lastCheck: new Date(),
  },
  settings: {
    theme: 'auto',
    autoRetry: true,
    maxRetries: 3,
    defaultTimeout: 30000,
    enableAnalytics: true,
    enableAI: true,
    notifications: {
      taskComplete: true,
      taskFailed: true,
      systemAlerts: true,
    },
  },
  
  addTask: (task) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          ...task,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    })),
  
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
      ),
    })),
  
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
  
  addWorkflow: (workflow) =>
    set((state) => ({
      workflows: [
        ...state.workflows,
        {
          ...workflow,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    })),
  
  updateWorkflow: (id, updates) =>
    set((state) => ({
      workflows: state.workflows.map((workflow) =>
        workflow.id === id ? { ...workflow, ...updates, updatedAt: new Date() } : workflow
      ),
    })),
  
  deleteWorkflow: (id) =>
    set((state) => ({
      workflows: state.workflows.filter((workflow) => workflow.id !== id),
    })),
  
  addMetric: (metric) =>
    set((state) => ({
      metrics: [...state.metrics.slice(-999), metric],
    })),
  
  clearMetrics: () => set({ metrics: [] }),
  
  updateSystemStatus: (status) =>
    set((state) => ({
      systemStatus: { ...state.systemStatus, ...status, lastCheck: new Date() },
    })),
  
  updateSettings: (updates) =>
    set((state) => ({
      settings: { ...state.settings, ...updates },
    })),
}));
