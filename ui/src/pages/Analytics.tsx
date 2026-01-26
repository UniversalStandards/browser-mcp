import { useStore } from '../store';
import { BarChart3, TrendingUp, Brain, Activity } from 'lucide-react';

export default function Analytics() {
  const { metrics } = useStore();

  const totalOps = metrics.length;
  const successCount = metrics.filter(m => m.success).length;
  const successRate = totalOps > 0 ? (successCount / totalOps * 100).toFixed(1) : '0';
  const avgDuration = totalOps > 0 ? (metrics.reduce((sum, m) => sum + m.durationMs, 0) / totalOps).toFixed(0) : '0';

  const operationCounts = metrics.reduce((acc, m) => {
    acc[m.operation] = (acc[m.operation] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topOperations = Object.entries(operationCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Analytics & Insights</h1>
        <p className="page-description">Performance metrics and learning insights</p>
      </div>

      <div className="grid grid-cols-3" style={{ marginBottom: '2rem' }}>
        <div className="card stat-card">
          <Activity size={24} color="var(--primary)" />
          <span className="stat-label">Total Operations</span>
          <span className="stat-value">{totalOps}</span>
        </div>
        <div className="card stat-card">
          <TrendingUp size={24} color="var(--success)" />
          <span className="stat-label">Success Rate</span>
          <span className="stat-value">{successRate}%</span>
        </div>
        <div className="card stat-card">
          <BarChart3 size={24} color="var(--warning)" />
          <span className="stat-label">Avg Duration</span>
          <span className="stat-value">{avgDuration}ms</span>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Top Operations</h3>
            <BarChart3 size={20} />
          </div>
          {topOperations.length === 0 ? (
            <div className="empty-state">
              <p>No data available yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {topOperations.map(([op, count]) => (
                <div key={op} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', backgroundColor: 'var(--background)', borderRadius: '0.375rem' }}>
                  <span style={{ fontWeight: 500 }}>{op}</span>
                  <span className="badge badge-primary">{count}x</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">AI Insights</h3>
            <Brain size={20} color="var(--secondary)" />
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {totalOps === 0 ? (
              <p>Start using automation tools to get AI-powered insights and recommendations.</p>
            ) : (
              <>
                <p style={{ marginBottom: '0.75rem' }}>
                  <strong>System Learning:</strong> {totalOps} operations recorded
                </p>
                {successRate === '100.0' ? (
                  <p style={{ color: 'var(--success)' }}>✨ Perfect success rate! Your automations are running flawlessly.</p>
                ) : parseFloat(successRate) > 90 ? (
                  <p style={{ color: 'var(--success)' }}>✅ Excellent success rate. Minor optimizations possible.</p>
                ) : parseFloat(successRate) > 70 ? (
                  <p style={{ color: 'var(--warning)' }}>⚠️ Good success rate but room for improvement. Consider using retry mechanisms.</p>
                ) : (
                  <p style={{ color: 'var(--error)' }}>❌ Low success rate detected. Review failed operations and use self-healing tools.</p>
                )}
                <p style={{ marginTop: '0.75rem' }}>
                  <strong>Recommendation:</strong> Use the AI tools (ai_analyze_error, ai_recommend_workflow) for optimization guidance.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
