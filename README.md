<a href="https://browsermcp.io">
  <img src="./.github/images/banner.png" alt="Browser MCP banner">
</a>

<h3 align="center">Browser MCP - AI-Powered Browser Automation</h3>

<p align="center">
  Automate your browser with AI capabilities, self-healing, and comprehensive monitoring.
  <br />
  <a href="https://browsermcp.io"><strong>Website</strong></a> 
  •
  <a href="https://docs.browsermcp.io"><strong>Docs</strong></a>
</p>

## 🚀 Features

### Core Capabilities
- ⚡ **Fast**: Local automation with minimal latency
- 🔒 **Private**: All automation stays on your device
- 👤 **Logged In**: Uses your existing browser profile
- 🥷🏼 **Stealth**: Avoids bot detection using real browser

### 🤖 AI-Powered Features (New!)
- **AI Error Analysis**: Intelligent error detection with actionable suggestions
- **Workflow Recommendations**: Context-aware automation guidance
- **Smart Element Detection**: AI-powered page analysis and element identification
- **Automation Suggestions**: Pattern recognition for workflow optimization

### 🔧 Self-Healing Capabilities (New!)
- **Automatic Retry**: Exponential backoff for failed operations
- **Health Monitoring**: Real-time connection and page state validation
- **Auto-Reconnect**: Intelligent reconnection with retry logic
- **Operation Validation**: Automatic verification and correction

### 📊 Analytics & Learning (New!)
- **Performance Metrics**: Track success rates and operation durations
- **Pattern Recognition**: Learn from operation history
- **Optimization Suggestions**: AI-driven performance recommendations
- **Historical Analysis**: Comprehensive operation insights

### 🎨 Production UI (New!)
- **Dashboard**: Real-time system status and metrics
- **Task Management**: Create, track, and manage automation tasks
- **Workflow Builder**: Visual workflow creation and management
- **Analytics View**: Performance insights and AI recommendations
- **Settings Panel**: Comprehensive configuration options

## 📦 Installation

```bash
# Install MCP server
npm install @browsermcp/mcp

# Install UI (optional)
cd ui
npm install
```

## 🎯 Usage

### Starting the MCP Server

```bash
npm start
```

### Running the UI Dashboard

```bash
cd ui
npm run dev
```

The dashboard will be available at `http://localhost:3000`

## 🛠️ Available Tools

### Standard Browser Operations
- `browser_navigate` - Navigate to URLs
- `browser_click` - Click elements
- `browser_type` - Type text into fields
- `browser_snapshot` - Capture page state
- `browser_screenshot` - Take screenshots
- `browser_get_console_logs` - Retrieve console logs

### AI-Powered Tools
- `ai_analyze_error` - Get intelligent error analysis and fixes
- `ai_recommend_workflow` - Receive workflow optimization suggestions
- `ai_suggest_automation` - Pattern-based automation recommendations
- `ai_detect_elements` - Smart element detection and interaction guidance

### Self-Healing Tools
- `retry_operation` - Retry failed operations with exponential backoff
- `health_check` - Comprehensive system health diagnostics
- `auto_reconnect` - Automatic reconnection management
- `validate_operation` - Verify operation success with auto-correction

### Analytics Tools
- `record_metric` - Log operation metrics for analysis
- `get_analytics` - Retrieve performance analytics
- `learn_from_history` - Analyze patterns and learn from history
- `recognize_pattern` - Identify workflow patterns
- `get_optimization_suggestions` - Get AI-powered optimization advice

## 📖 Examples

### Basic Navigation with AI Error Handling

```javascript
// Navigate with automatic retry on failure
await mcp.call('retry_operation', {
  operation: 'browser_navigate',
  operationParams: { url: 'https://example.com' },
  maxRetries: 3
});

// Get AI recommendations for next steps
await mcp.call('ai_recommend_workflow', {
  taskDescription: 'Fill out a contact form',
  pageUrl: 'https://example.com/contact'
});
```

### Self-Healing Workflow

```javascript
// Check system health before starting
const health = await mcp.call('health_check', {
  includePageInfo: true
});

// Perform operation with validation
await mcp.call('browser_click', {
  element: 'Submit button',
  ref: 'submit-btn'
});

// Validate the operation succeeded
await mcp.call('validate_operation', {
  operationType: 'click',
  expectedOutcome: 'Form submitted successfully'
});
```

### Analytics and Learning

```javascript
// Record operation metrics
await mcp.call('record_metric', {
  operation: 'form_submission',
  success: true,
  durationMs: 1250,
  pattern: 'contact_form_flow'
});

// Get performance insights
const analytics = await mcp.call('get_analytics', {
  includePatterns: true
});

// Learn from history
const insights = await mcp.call('learn_from_history', {
  lookbackMinutes: 60
});
```

## 🏗️ Architecture

```
browser-mcp/
├── src/               # MCP Server source
│   ├── tools/        # Tool implementations
│   │   ├── ai.ts            # AI-powered tools
│   │   ├── self-healing.ts  # Self-healing tools
│   │   ├── analytics.ts     # Analytics & learning
│   │   ├── common.ts        # Standard tools
│   │   ├── custom.ts        # Custom tools
│   │   └── snapshot.ts      # Snapshot tools
│   ├── context.ts    # WebSocket context
│   ├── server.ts     # MCP server setup
│   └── index.ts      # Entry point
├── ui/               # Web dashboard
│   ├── src/
│   │   ├── pages/       # Dashboard pages
│   │   ├── components/  # React components
│   │   ├── store/       # State management
│   │   └── types/       # TypeScript types
│   └── public/         # Static assets
└── stubs/            # Dependency stubs

```

## 🤝 Contributing

This repo contains the core MCP code for Browser MCP. Due to monorepo dependencies, it requires stub implementations for building standalone.

## 📝 License

Apache 2.0 - See LICENSE file for details

## 🙏 Credits

Browser MCP was adapted from the [Playwright MCP server](https://github.com/microsoft/playwright-mcp) to enable automation of the user's actual browser rather than creating new instances.

---

**Built with ❤️ for the future of browser automation**
