import { useState } from 'react';
import { useStore } from '../store';
import { Plus, Play, Trash2, Edit2, Workflow as WorkflowIcon } from 'lucide-react';

export default function Workflows() {
  const { workflows, addWorkflow, deleteWorkflow } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({ name: '', description: '', steps: [] });

  const handleCreate = () => {
    if (newWorkflow.name.trim()) {
      addWorkflow({ ...newWorkflow, steps: [], isTemplate: false });
      setNewWorkflow({ name: '', description: '', steps: [] });
      setShowCreate(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Workflows</h1>
          <p className="page-description">Build and manage automation workflows</p>
        </div>
        <button className="button button-primary" onClick={() => setShowCreate(true)}>
          <Plus size={16} />
          New Workflow
        </button>
      </div>

      {showCreate && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Create New Workflow</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Workflow name"
              value={newWorkflow.name}
              onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
              style={{ padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.375rem', backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}
            />
            <textarea
              placeholder="Description"
              value={newWorkflow.description}
              onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
              rows={3}
              style={{ padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.375rem', backgroundColor: 'var(--background)', color: 'var(--text-primary)', resize: 'vertical' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button className="button button-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="button button-primary" onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      )}

      {workflows.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <WorkflowIcon size={48} className="empty-state-icon" />
            <p className="empty-state-title">No workflows yet</p>
            <p>Create reusable workflows to automate complex tasks</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>{workflow.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{workflow.description}</p>
                  <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span>{workflow.steps.length} steps</span>
                    <span style={{ margin: '0 0.5rem' }}>•</span>
                    <span>{workflow.isTemplate ? 'Template' : 'Custom'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="button button-sm button-primary" title="Run workflow">
                    <Play size={14} />
                  </button>
                  <button className="button button-sm button-secondary" title="Edit workflow">
                    <Edit2 size={14} />
                  </button>
                  <button className="button button-sm button-secondary" onClick={() => deleteWorkflow(workflow.id)} title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
