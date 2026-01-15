import { useState } from 'react';
import { useStore } from '../store';
import { Plus, Play, Trash2, Edit, CheckCircle, Clock, AlertCircle, ListTodo } from 'lucide-react';
import type { Task } from '../types';

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask } = useStore();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    tags: [] as string[],
  });

  const handleCreateTask = () => {
    if (newTask.title.trim()) {
      addTask({
        ...newTask,
        status: 'pending',
        tags: newTask.tags,
      });
      setNewTask({ title: '', description: '', priority: 'medium', tags: [] });
      setShowCreateDialog(false);
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} color="var(--success)" />;
      case 'running':
        return <Clock size={16} color="var(--warning)" />;
      case 'failed':
        return <AlertCircle size={16} color="var(--error)" />;
      default:
        return <Clock size={16} color="var(--text-secondary)" />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'var(--error)';
      case 'high':
        return 'var(--warning)';
      case 'low':
        return 'var(--text-secondary)';
      default:
        return 'var(--primary)';
    }
  };

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-description">Manage and track automation tasks</p>
        </div>
        <button className="button button-primary" onClick={() => setShowCreateDialog(true)}>
          <Plus size={16} />
          New Task
        </button>
      </div>

      {showCreateDialog && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Create New Task</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                Title *
              </label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Enter task title"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid var(--border)',
                  borderRadius: '0.375rem',
                  backgroundColor: 'var(--background)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                Description
              </label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Enter task description"
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid var(--border)',
                  borderRadius: '0.375rem',
                  backgroundColor: 'var(--background)',
                  color: 'var(--text-primary)',
                  resize: 'vertical',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                Priority
              </label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                style={{
                  padding: '0.5rem',
                  border: '1px solid var(--border)',
                  borderRadius: '0.375rem',
                  backgroundColor: 'var(--background)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button className="button button-secondary" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </button>
              <button className="button button-primary" onClick={handleCreateTask}>
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <ListTodo size={48} className="empty-state-icon" />
            <p className="empty-state-title">No tasks yet</p>
            <p>Create your first automation task to get started</p>
          </div>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
          {tasks.map((task) => (
            <div key={task.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    {getStatusIcon(task.status)}
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{task.title}</h3>
                    <span className={`badge badge-${task.status === 'completed' ? 'success' : task.status === 'failed' ? 'error' : 'warning'}`}>
                      {task.status}
                    </span>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: getPriorityColor(task.priority),
                      }}
                      title={`Priority: ${task.priority}`}
                    />
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{task.description}</p>
                  {task.tags.length > 0 && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {task.tags.map((tag) => (
                        <span key={tag} className="badge badge-secondary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {task.status === 'pending' && (
                    <button
                      className="button button-sm button-primary"
                      onClick={() => updateTask(task.id, { status: 'running' })}
                      title="Start task"
                    >
                      <Play size={14} />
                    </button>
                  )}
                  <button
                    className="button button-sm button-secondary"
                    onClick={() => deleteTask(task.id)}
                    title="Delete task"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem' }}>
                <span>Created: {new Date(task.createdAt).toLocaleString()}</span>
                <span>Updated: {new Date(task.updatedAt).toLocaleString()}</span>
              </div>
              {task.error && (
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.375rem', color: 'var(--error)', fontSize: '0.875rem' }}>
                  <strong>Error:</strong> {task.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
