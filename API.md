# Browser MCP API Documentation

## Table of Contents

1. [Standard Browser Operations](#standard-browser-operations)
2. [AI-Powered Tools](#ai-powered-tools)
3. [Self-Healing Tools](#self-healing-tools)
4. [Analytics & Learning Tools](#analytics--learning-tools)

---

## Standard Browser Operations

### browser_navigate
Navigate to a URL in the browser.

**Parameters:**
- `url` (string, required): The URL to navigate to

**Example:**
```json
{
  "url": "https://example.com"
}
```

### browser_click
Click on an element in the page.

**Parameters:**
- `element` (string, required): Human-readable element description
- `ref` (string, required): Element reference from snapshot

**Example:**
```json
{
  "element": "Submit button",
  "ref": "button-submit"
}
```

### browser_type
Type text into an input field.

**Parameters:**
- `element` (string, required): Human-readable element description
- `ref` (string, required): Element reference from snapshot
- `text` (string, required): Text to type

**Example:**
```json
{
  "element": "Email input",
  "ref": "input-email",
  "text": "user@example.com"
}
```

### browser_snapshot
Capture an accessibility snapshot of the current page.

**Parameters:** None

**Returns:** ARIA snapshot of the page in YAML format

### browser_screenshot
Take a screenshot of the current page.

**Parameters:** None

**Returns:** Base64-encoded PNG image

### browser_get_console_logs
Retrieve console logs from the browser.

**Parameters:** None

**Returns:** Array of console log entries

---

## AI-Powered Tools

### ai_analyze_error
Analyze errors and provide AI-powered suggestions for fixing them.

**Parameters:**
- `errorMessage` (string, required): The error message to analyze
- `context` (string, optional): Additional context about when the error occurred

**Example:**
```json
{
  "errorMessage": "Element not found: #submit-button",
  "context": "Attempting to submit a form after filling fields"
}
```

**Response:**
```
## AI Error Analysis

**Error:** Element not found: #submit-button
**Context:** Attempting to submit a form after filling fields
**Confidence:** high

**Suggestions:**
1. Verify the element selector is correct
2. Check if the element appears after page load (use wait strategies)
3. Inspect the page structure to ensure the element exists

**Recommended Actions:** Try the suggested solutions in order
```

### ai_recommend_workflow
Get AI-powered recommendations for optimizing browser automation workflows.

**Parameters:**
- `taskDescription` (string, required): Description of what you want to accomplish
- `pageUrl` (string, optional): Current page URL

**Example:**
```json
{
  "taskDescription": "Fill out and submit a contact form",
  "pageUrl": "https://example.com/contact"
}
```

**Response:**
```
## AI Workflow Recommendations

**Task:** Fill out and submit a contact form
**Current Page:** Contact Us - Example.com

**Recommended Workflow:**
1. Take a snapshot to identify form fields
2. Use browser_type to fill in text fields sequentially
3. Use browser_select_option for dropdowns
4. Take a screenshot before submitting to verify data
5. Use browser_click to submit the form
6. Wait for confirmation message or page navigation

**Pro Tips:**
• Always take snapshots before interacting with new pages
• Use wait commands between actions for dynamic content
• Take screenshots to verify visual changes
• Check console logs when troubleshooting
```

### ai_suggest_automation
Get intelligent suggestions for automating repetitive tasks.

**Parameters:**
- `recentOperations` (array, optional): List of recent operations performed

**Example:**
```json
{
  "recentOperations": [
    "browser_navigate",
    "browser_type",
    "browser_type",
    "browser_type",
    "browser_click"
  ]
}
```

**Response:**
```
## Automation Suggestions

**Patterns Detected:**
• Form filling pattern detected

**Suggestions:**
1. Consider creating a form-filling workflow template
2. Store form data in a configuration file for reusability

**Best Practices:**
• Use descriptive names for saved workflows
• Include error handling in automation scripts
• Test workflows with different data sets
• Document workflow steps for team collaboration
```

### ai_detect_elements
Use AI to intelligently detect and categorize interactive elements on the page.

**Parameters:**
- `elementType` (string, optional): Type of element to focus on (e.g., 'button', 'input', 'link')

**Example:**
```json
{
  "elementType": "button"
}
```

**Response:**
```
## AI Element Detection

**Detected Elements:**
• Buttons detected - likely interactive elements
• Text input fields detected

**Interaction Recommendations:**
1. Use browser_click for button interactions
2. Use browser_type to fill in text fields
3. Take snapshot first to identify exact field references

**Page Snapshot:**
[ARIA snapshot included]
```

---

## Self-Healing Tools

### retry_operation
Retry a failed operation with exponential backoff and intelligent error recovery.

**Parameters:**
- `operation` (string, required): The operation name to retry
- `operationParams` (object, required): Parameters for the operation
- `maxRetries` (number, optional, default: 3): Maximum number of retry attempts
- `initialDelayMs` (number, optional, default: 1000): Initial delay in milliseconds

**Example:**
```json
{
  "operation": "browser_click",
  "operationParams": {
    "element": "Submit button",
    "ref": "btn-submit"
  },
  "maxRetries": 3,
  "initialDelayMs": 1000
}
```

**Response:**
```
✅ Operation succeeded on attempt 2/3

Operation: browser_click
Result: [operation result]

Attempt History:
  Attempt 1: ❌ Failed - Connection timeout (waited 1000ms)
  Attempt 2: ✅ Success
```

### health_check
Perform comprehensive health check of the browser connection and page state.

**Parameters:**
- `includePageInfo` (boolean, optional, default: true): Include current page information

**Example:**
```json
{
  "includePageInfo": true
}
```

**Response:**
```
## System Health Check

**Overall Status:** ✅ HEALTHY

**Connection:** ✅ WebSocket connection established

**Page State:** ✅ Page is accessible
  - URL: https://example.com
  - Title: Example Domain

**Console:** ✅ No console errors detected

All systems operational! 🚀
```

### auto_reconnect
Attempt to automatically reconnect to the browser extension.

**Parameters:**
- `maxAttempts` (number, optional, default: 5): Maximum reconnection attempts

**Example:**
```json
{
  "maxAttempts": 5
}
```

### validate_operation
Validate that an operation completed successfully by checking the resulting page state.

**Parameters:**
- `operationType` (string, required): Type of operation to validate
- `expectedOutcome` (string, required): Description of the expected outcome
- `validationChecks` (array, optional): Specific checks to perform

**Example:**
```json
{
  "operationType": "form_submission",
  "expectedOutcome": "Success message displayed",
  "validationChecks": ["success", "thank you"]
}
```

**Response:**
```
## Operation Validation

**Operation:** form_submission
**Expected:** Success message displayed
**Result:** ✅ PASSED

**Validation Checks:**
✅ Page responsiveness: Page is accessible at https://example.com/thanks
✅ Console errors: No console errors detected
✅ Page snapshot: Successfully captured page state
✅ Custom: success: Element/content found in page
✅ Custom: thank you: Element/content found in page

**Status:** All checks passed successfully! ✨
```

---

## Analytics & Learning Tools

### record_metric
Record performance and success metrics for an operation.

**Parameters:**
- `operation` (string, required): Operation name
- `success` (boolean, required): Whether the operation succeeded
- `durationMs` (number, required): Duration in milliseconds
- `errorMessage` (string, optional): Error message if failed
- `pattern` (string, optional): Pattern identifier for this operation type

**Example:**
```json
{
  "operation": "login_flow",
  "success": true,
  "durationMs": 1250,
  "pattern": "authentication_workflow"
}
```

### get_analytics
Get comprehensive analytics report including success rates and performance metrics.

**Parameters:**
- `operation` (string, optional): Filter by specific operation
- `includePatterns` (boolean, optional, default: true): Include pattern analysis

**Example:**
```json
{
  "includePatterns": true
}
```

**Response:**
```
## Analytics Report

**Total Operations:** 150
**Success Rate:** 94.7%
**Average Duration:** 1248ms

**Recent Operations:**
1. browser_navigate - ✅ (324ms)
2. browser_click - ✅ (156ms)
3. browser_type - ✅ (234ms)
...

**Learned Patterns (Top 10):**
1. login_workflow - Used 25x, 96.0% success
2. form_submission - Used 18x, 94.4% success
3. navigation_flow - Used 12x, 100.0% success
...

**Insights:**
✅ Good success rate. Minor improvements possible.
```

### learn_from_history
Analyze operation history to identify successful patterns and common failures.

**Parameters:**
- `lookbackMinutes` (number, optional, default: 60): How far back to analyze (in minutes)

**Example:**
```json
{
  "lookbackMinutes": 60
}
```

### recognize_pattern
Identify if the current sequence of operations matches a known successful pattern.

**Parameters:**
- `currentSequence` (array, required): Current sequence of operations

**Example:**
```json
{
  "currentSequence": [
    "browser_navigate",
    "browser_type",
    "browser_click"
  ]
}
```

**Response:**
```
## Pattern Recognition

**Current Sequence:**
1. browser_navigate
2. browser_type
3. browser_click

**Similar Known Patterns:**
1. login_workflow
   Used 25x, 96.0% success rate

**Recommendation:**
✅ Your current approach aligns with successful pattern: "login_workflow"
This pattern has a 96.0% success rate.
```

### get_optimization_suggestions
Get AI-powered suggestions for optimizing operation performance.

**Parameters:** None

**Response:**
```
## Optimization Suggestions

**Current Performance:**
• Average Duration: 1248ms
• Success Rate: 94.7%
• Operations Tracked: 150
• Patterns Learned: 15

**Improve Reliability:**
  • Use retry_operation for operations with transient failures
  • Add validate_operation after critical steps
  • Use health_check to verify system state before operations

**Workflow Optimization:**
  • Most frequent pattern: "login_workflow" (25x)
  • Consider creating reusable workflow templates

**Best Practices:**
  • Use snapshots before interactions to verify page state
  • Record metrics for continuous learning
  • Implement error handling at workflow level
  • Use AI tools (ai_analyze_error, ai_recommend_workflow) for guidance
```

---

## Error Handling

All tools follow consistent error handling:

**Success Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Operation result..."
    }
  ]
}
```

**Error Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Error description..."
    }
  ],
  "isError": true
}
```

## Best Practices

1. **Always check system health** before starting automation workflows
2. **Use AI tools** to get recommendations and error analysis
3. **Record metrics** to enable learning and optimization
4. **Implement retry logic** for operations that may fail transiently
5. **Validate operations** after critical steps to ensure success
6. **Take snapshots** before interacting with new pages
7. **Monitor analytics** to identify optimization opportunities

---

For more information, visit [browsermcp.io](https://browsermcp.io)
