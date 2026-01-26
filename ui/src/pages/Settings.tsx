import { useStore } from '../store';
import { Save, Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  const { settings, updateSettings } = useStore();

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-description">Configure your automation preferences</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SettingsIcon size={20} />
          General Settings
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'light' || value === 'dark' || value === 'auto') {
                  updateSettings({ theme: value });
                }
              }}
              style={{ padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.375rem', backgroundColor: 'var(--background)', color: 'var(--text-primary)', width: '200px' }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="checkbox"
              id="autoRetry"
              checked={settings.autoRetry}
              onChange={(e) => updateSettings({ autoRetry: e.target.checked })}
              style={{ width: '18px', height: '18px' }}
            />
            <label htmlFor="autoRetry" style={{ fontWeight: 500 }}>Enable automatic retry on failure</label>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Max Retries: {settings.maxRetries}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={settings.maxRetries}
              onChange={(e) => updateSettings({ maxRetries: parseInt(e.target.value) })}
              style={{ width: '300px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Default Timeout (ms): {settings.defaultTimeout}
            </label>
            <input
              type="range"
              min="5000"
              max="120000"
              step="5000"
              value={settings.defaultTimeout}
              onChange={(e) => updateSettings({ defaultTimeout: parseInt(e.target.value) })}
              style={{ width: '300px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="checkbox"
              id="enableAnalytics"
              checked={settings.enableAnalytics}
              onChange={(e) => updateSettings({ enableAnalytics: e.target.checked })}
              style={{ width: '18px', height: '18px' }}
            />
            <label htmlFor="enableAnalytics" style={{ fontWeight: 500 }}>Enable analytics and metrics collection</label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="checkbox"
              id="enableAI"
              checked={settings.enableAI}
              onChange={(e) => updateSettings({ enableAI: e.target.checked })}
              style={{ width: '18px', height: '18px' }}
            />
            <label htmlFor="enableAI" style={{ fontWeight: 500 }}>Enable AI-powered features</label>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Notifications</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="checkbox"
              id="notifyTaskComplete"
              checked={settings.notifications.taskComplete}
              onChange={(e) => updateSettings({ notifications: { ...settings.notifications, taskComplete: e.target.checked } })}
              style={{ width: '18px', height: '18px' }}
            />
            <label htmlFor="notifyTaskComplete">Notify when tasks complete</label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="checkbox"
              id="notifyTaskFailed"
              checked={settings.notifications.taskFailed}
              onChange={(e) => updateSettings({ notifications: { ...settings.notifications, taskFailed: e.target.checked } })}
              style={{ width: '18px', height: '18px' }}
            />
            <label htmlFor="notifyTaskFailed">Notify when tasks fail</label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="checkbox"
              id="notifySystemAlerts"
              checked={settings.notifications.systemAlerts}
              onChange={(e) => updateSettings({ notifications: { ...settings.notifications, systemAlerts: e.target.checked } })}
              style={{ width: '18px', height: '18px' }}
            />
            <label htmlFor="notifySystemAlerts">System alerts and warnings</label>
          </div>
        </div>
      </div>

      <button className="button button-primary" onClick={handleSave} style={{ marginTop: '2rem' }}>
        <Save size={16} />
        Save Settings
      </button>
    </div>
  );
}
