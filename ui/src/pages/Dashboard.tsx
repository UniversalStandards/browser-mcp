import { useStore } from '../store';
import { Activity, CheckCircle, Clock, AlertCircle, TrendingUp, Zap } from 'lucide-react';

export default function Dashboard() {
  const { tasks, metrics, systemStatus } = useStore();

  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const runningTasks = tasks.filter(t => t.status === 'running').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const failedTasks = tasks.filter(t => t.status === 'failed').length;

  const recentMetrics = metrics.slice(-10);
  const successRate = metrics.length > 0
    ? (metrics.filter(m => m.success).length / metrics.length * 100).toFixed(1)
    : '0';
  
  const avgDuration = metrics.length > 0
    ? (metrics.reduce((sum, m) => sum + m.durationMs, 0) / metrics.length / 1000).toFixed(2)
    : '0';

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">
          AI-Powered Browser Automation Control Center
        </p>
      </div>

      {/* System Status */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">System Status</h2>
          <span className={`badge badge-${systemStatus.connection === 'healthy' ? 'success' : systemStatus.connection === 'unhealthy' ? 'error' : 'warning'}`}>
            {systemStatus.connection === 'healthy' ? '● Connected' : systemStatus.connection === 'unhealthy' ? '● Disconnected' : '● Unknown'}
          </span>
        </div>
        {systemStatus.pageUrl && (
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <p><strong>Current Page:</strong> {systemStatus.pageTitle || 'Untitled'}</p>
            <p><strong>URL:</strong> {systemStatus.pageUrl}</p>
            <p><strong>Console Errors:</strong> {systemStatus.errorCount}</p>
            <p><strong>Last Check:</strong> {systemStatus.lastCheck.toLocaleTimeString()}</p>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="card stat-card">
          <Activity size={24} color="var(--primary)" />
          <span className="stat-label">Total Tasks</span>
          <span className="stat-value">{tasks.length}</span>
        </div>
        
        <div className="card stat-card">
          <Clock size={24} color="var(--warning)" />
          <span className="stat-label">Running</span>
          <span className="stat-value">{runningTasks}</span>
        </div>
        
        <div className="card stat-card">
          <CheckCircle size={24} color="var(--success)" />
          <span className="stat-label">Completed</span>
          <span className="stat-value">{completedTasks}</span>
        </div>
        
        <div className="card stat-card">
          <AlertCircle size={24} color="var(--error)" />
          <span className="stat-label">Failed</span>
          <span className="stat-value">{failedTasks}</span>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Success Rate</h3>
            <TrendingUp size={20} color="var(--success)" />
          </div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>
            {successRate}%
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Based on {metrics.length} operations
          </p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Avg Response Time</h3>
            <Zap size={20} color="var(--warning)" />
          </div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>
            {avgDuration}s
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Average operation duration
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Operations</h3>
        </div>
        {recentMetrics.length === 0 ? (
          <div className="empty-state">
            <Activity size={48} className="empty-state-icon" />
            <p className="empty-state-title">No operations yet</p>
            <p>Start automating to see activity here</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentMetrics.reverse().map((metric, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: 'var(--background)',
                  borderRadius: '0.375rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {metric.success ? (
                    <CheckCircle size={16} color="var(--success)" />
                  ) : (
                    <AlertCircle size={16} color="var(--error)" />
                  )}
                  <span style={{ fontWeight: 500 }}>{metric.operation}</span>
                  {metric.errorMessage && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--error)' }}>
                      {metric.errorMessage}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <span>{metric.durationMs}ms</span>
                  <span>{new Date(metric.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
