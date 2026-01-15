# Browser MCP Usage Examples

This document provides practical examples of using Browser MCP's powerful automation capabilities.

## Table of Contents

1. [Basic Automation](#basic-automation)
2. [AI-Powered Workflows](#ai-powered-workflows)
3. [Self-Healing Operations](#self-healing-operations)
4. [Analytics and Learning](#analytics-and-learning)
5. [Complete Workflows](#complete-workflows)

---

## Basic Automation

### Example 1: Simple Navigation and Screenshot

```javascript
// Navigate to a website
await mcp.call('browser_navigate', {
  url: 'https://example.com'
});

// Wait for page to load
await mcp.call('browser_wait', {
  time: 2
});

// Take a screenshot
const screenshot = await mcp.call('browser_screenshot', {});

// Get page snapshot for analysis
const snapshot = await mcp.call('browser_snapshot', {});
```

### Example 2: Form Filling

```javascript
// Navigate to form page
await mcp.call('browser_navigate', {
  url: 'https://example.com/contact'
});

// Get snapshot to identify fields
const snapshot = await mcp.call('browser_snapshot', {});

// Fill in name field
await mcp.call('browser_type', {
  element: 'Name input',
  ref: 'input-name',
  text: 'John Doe'
});

// Fill in email field
await mcp.call('browser_type', {
  element: 'Email input',
  ref: 'input-email',
  text: 'john@example.com'
});

// Fill in message
await mcp.call('browser_type', {
  element: 'Message textarea',
  ref: 'textarea-message',
  text: 'This is my message.'
});

// Submit the form
await mcp.call('browser_click', {
  element: 'Submit button',
  ref: 'button-submit'
});
```

---

## AI-Powered Workflows

### Example 3: Error Analysis and Recovery

```javascript
try {
  // Attempt an operation
  await mcp.call('browser_click', {
    element: 'Login button',
    ref: 'btn-login'
  });
} catch (error) {
  // Use AI to analyze the error
  const analysis = await mcp.call('ai_analyze_error', {
    errorMessage: error.message,
    context: 'Attempting to click login button after filling credentials'
  });
  
  console.log('AI Analysis:', analysis);
  // Follow the AI suggestions to fix the issue
}
```

### Example 4: Workflow Recommendations

```javascript
// Get AI recommendations for a task
const recommendations = await mcp.call('ai_recommend_workflow', {
  taskDescription: 'Extract product information from an e-commerce site',
  pageUrl: 'https://shop.example.com/products'
});

console.log('Recommended workflow:', recommendations);

// Follow the recommended steps
// 1. Take a snapshot to identify elements
const snapshot = await mcp.call('browser_snapshot', {});

// 2. Identify product elements using AI
const elements = await mcp.call('ai_detect_elements', {
  elementType: 'link'
});

// Continue with the workflow...
```

### Example 5: Smart Element Detection

```javascript
// Navigate to a complex page
await mcp.call('browser_navigate', {
  url: 'https://example.com/dashboard'
});

// Use AI to detect interactive elements
const detection = await mcp.call('ai_detect_elements', {});

console.log('Detected elements:', detection);

// AI will identify buttons, inputs, links, etc.
// and provide recommendations for interaction
```

### Example 6: Automation Pattern Suggestions

```javascript
const recentOps = [
  'browser_navigate',
  'browser_type', 
  'browser_type',
  'browser_click',
  'browser_navigate',
  'browser_type',
  'browser_type', 
  'browser_click'
];

// Get automation suggestions based on patterns
const suggestions = await mcp.call('ai_suggest_automation', {
  recentOperations: recentOps
});

console.log('Automation suggestions:', suggestions);
// AI detects repetitive form-filling pattern and suggests creating a template
```

---

## Self-Healing Operations

### Example 7: Retry with Exponential Backoff

```javascript
// Retry an operation that might fail due to timing issues
const result = await mcp.call('retry_operation', {
  operation: 'browser_click',
  operationParams: {
    element: 'Dynamic button',
    ref: 'btn-dynamic'
  },
  maxRetries: 5,
  initialDelayMs: 1000
});

// The operation will retry with delays: 1s, 2s, 4s, 8s, 16s
console.log('Operation result:', result);
```

### Example 8: Health Check Before Operations

```javascript
// Check system health before starting workflow
const health = await mcp.call('health_check', {
  includePageInfo: true
});

console.log('System health:', health);

if (health.connection === 'healthy') {
  // Proceed with automation
  await mcp.call('browser_navigate', {
    url: 'https://example.com'
  });
} else {
  // Attempt reconnection
  await mcp.call('auto_reconnect', {
    maxAttempts: 5
  });
}
```

### Example 9: Auto-Reconnection

```javascript
// Automatic reconnection with retry logic
try {
  await mcp.call('browser_navigate', {
    url: 'https://example.com'
  });
} catch (error) {
  if (error.message.includes('connection')) {
    console.log('Connection lost, attempting auto-reconnect...');
    
    const reconnect = await mcp.call('auto_reconnect', {
      maxAttempts: 5
    });
    
    if (reconnect.success) {
      // Retry the operation
      await mcp.call('browser_navigate', {
        url: 'https://example.com'
      });
    }
  }
}
```

### Example 10: Operation Validation

```javascript
// Click submit button
await mcp.call('browser_click', {
  element: 'Submit button',
  ref: 'btn-submit'
});

// Wait for submission to complete
await mcp.call('browser_wait', { time: 2 });

// Validate the operation succeeded
const validation = await mcp.call('validate_operation', {
  operationType: 'form_submission',
  expectedOutcome: 'Success message displayed',
  validationChecks: ['success', 'thank you', 'submitted']
});

console.log('Validation result:', validation);

if (!validation.passed) {
  // Handle validation failure
  console.error('Operation validation failed');
  // Retry or take corrective action
}
```

---

## Analytics and Learning

### Example 11: Recording Metrics

```javascript
const startTime = Date.now();

try {
  // Perform operation
  await mcp.call('browser_navigate', {
    url: 'https://example.com'
  });
  
  await mcp.call('browser_click', {
    element: 'Login button',
    ref: 'btn-login'
  });
  
  const duration = Date.now() - startTime;
  
  // Record success metric
  await mcp.call('record_metric', {
    operation: 'login_flow',
    success: true,
    durationMs: duration,
    pattern: 'user_authentication'
  });
} catch (error) {
  const duration = Date.now() - startTime;
  
  // Record failure metric
  await mcp.call('record_metric', {
    operation: 'login_flow',
    success: false,
    durationMs: duration,
    errorMessage: error.message,
    pattern: 'user_authentication'
  });
}
```

### Example 12: Analytics Dashboard

```javascript
// Get comprehensive analytics
const analytics = await mcp.call('get_analytics', {
  includePatterns: true
});

console.log('Total operations:', analytics.totalOps);
console.log('Success rate:', analytics.successRate);
console.log('Average duration:', analytics.avgDuration);
console.log('Learned patterns:', analytics.patterns);

// Get analytics for specific operation
const loginAnalytics = await mcp.call('get_analytics', {
  operation: 'login_flow',
  includePatterns: false
});
```

### Example 13: Learning from History

```javascript
// Analyze last hour of operations
const insights = await mcp.call('learn_from_history', {
  lookbackMinutes: 60
});

console.log('Historical insights:', insights);

// Insights include:
// - Most used operations
// - Operations with high failure rates
// - Common error patterns
// - Fast vs slow operations
```

### Example 14: Pattern Recognition

```javascript
// Current workflow sequence
const currentSequence = [
  'browser_navigate',
  'browser_type',
  'browser_type',
  'browser_click',
  'browser_wait',
  'validate_operation'
];

// Check if it matches known patterns
const pattern = await mcp.call('recognize_pattern', {
  currentSequence
});

console.log('Pattern recognition:', pattern);

if (pattern.similarPatterns.length > 0) {
  console.log('This workflow is similar to:', pattern.similarPatterns[0]);
  console.log('Historical success rate:', pattern.similarPatterns[0].successRate);
}
```

### Example 15: Optimization Suggestions

```javascript
// Get AI-powered optimization suggestions
const suggestions = await mcp.call('get_optimization_suggestions', {});

console.log('Current performance:', suggestions.currentPerformance);
console.log('Optimization suggestions:', suggestions.suggestions);

// Implement suggested optimizations
// Example: Add retry logic for operations with < 90% success rate
```

---

## Complete Workflows

### Example 16: E-commerce Product Search with Self-Healing

```javascript
async function searchProduct(productName) {
  // Check system health first
  const health = await mcp.call('health_check', {
    includePageInfo: true
  });
  
  if (health.connection !== 'healthy') {
    await mcp.call('auto_reconnect', { maxAttempts: 3 });
  }
  
  // Get AI recommendations
  const recommendations = await mcp.call('ai_recommend_workflow', {
    taskDescription: `Search for product: ${productName}`,
    pageUrl: 'https://shop.example.com'
  });
  
  console.log('Following AI recommendations:', recommendations);
  
  const startTime = Date.now();
  
  try {
    // Navigate with retry
    await mcp.call('retry_operation', {
      operation: 'browser_navigate',
      operationParams: { url: 'https://shop.example.com' },
      maxRetries: 3
    });
    
    // Wait for page load
    await mcp.call('browser_wait', { time: 2 });
    
    // Detect search elements
    const elements = await mcp.call('ai_detect_elements', {
      elementType: 'input'
    });
    
    // Type search query
    await mcp.call('browser_type', {
      element: 'Search input',
      ref: 'input-search',
      text: productName
    });
    
    // Click search button with retry
    await mcp.call('retry_operation', {
      operation: 'browser_click',
      operationParams: {
        element: 'Search button',
        ref: 'btn-search'
      },
      maxRetries: 3
    });
    
    // Wait for results
    await mcp.call('browser_wait', { time: 2 });
    
    // Validate operation
    await mcp.call('validate_operation', {
      operationType: 'search',
      expectedOutcome: 'Search results displayed',
      validationChecks: ['results', productName.toLowerCase()]
    });
    
    // Take screenshot of results
    const screenshot = await mcp.call('browser_screenshot', {});
    
    // Record success metric
    const duration = Date.now() - startTime;
    await mcp.call('record_metric', {
      operation: 'product_search',
      success: true,
      durationMs: duration,
      pattern: 'ecommerce_search'
    });
    
    return { success: true, screenshot };
    
  } catch (error) {
    // AI error analysis
    const analysis = await mcp.call('ai_analyze_error', {
      errorMessage: error.message,
      context: `Searching for product: ${productName}`
    });
    
    console.error('Error analysis:', analysis);
    
    // Record failure metric
    const duration = Date.now() - startTime;
    await mcp.call('record_metric', {
      operation: 'product_search',
      success: false,
      durationMs: duration,
      errorMessage: error.message,
      pattern: 'ecommerce_search'
    });
    
    return { success: false, error: error.message, analysis };
  }
}

// Usage
const result = await searchProduct('wireless headphones');
console.log('Search result:', result);
```

### Example 17: Continuous Monitoring and Auto-Healing

```javascript
async function monitorAndHeal() {
  while (true) {
    // Check health every 30 seconds
    const health = await mcp.call('health_check', {
      includePageInfo: true
    });
    
    console.log('Health check:', health);
    
    if (health.connection !== 'healthy') {
      console.log('Unhealthy connection detected, attempting auto-heal...');
      
      await mcp.call('auto_reconnect', {
        maxAttempts: 5
      });
    }
    
    if (health.errorCount > 5) {
      console.warn('High error count detected:', health.errorCount);
      
      // Get console logs for analysis
      const logs = await mcp.call('browser_get_console_logs', {});
      console.log('Recent errors:', logs.slice(-5));
      
      // Use AI to analyze errors
      const errorMessages = logs
        .filter(log => log.level === 'error')
        .map(log => log.message);
      
      for (const errorMsg of errorMessages) {
        const analysis = await mcp.call('ai_analyze_error', {
          errorMessage: errorMsg,
          context: 'Continuous monitoring detected error'
        });
        console.log('Error analysis:', analysis);
      }
    }
    
    // Get optimization suggestions periodically
    const suggestions = await mcp.call('get_optimization_suggestions', {});
    console.log('Optimization suggestions:', suggestions);
    
    // Wait before next check
    await new Promise(resolve => setTimeout(resolve, 30000));
  }
}

// Start monitoring (in production, use proper process management)
monitorAndHeal().catch(console.error);
```

### Example 18: Data-Driven Workflow with Learning

```javascript
async function intelligentDataExtraction(urls) {
  const results = [];
  
  for (const url of urls) {
    // Check if similar pattern exists
    const pattern = await mcp.call('recognize_pattern', {
      currentSequence: ['browser_navigate', 'browser_snapshot', 'data_extraction']
    });
    
    console.log('Pattern match:', pattern);
    
    const startTime = Date.now();
    
    try {
      // Navigate with learned optimal timeout
      await mcp.call('retry_operation', {
        operation: 'browser_navigate',
        operationParams: { url },
        maxRetries: 3,
        initialDelayMs: 2000
      });
      
      // Smart wait based on historical data
      const analytics = await mcp.call('get_analytics', {
        operation: 'browser_navigate'
      });
      
      const optimalWait = Math.ceil(analytics.avgDuration / 1000) + 1;
      await mcp.call('browser_wait', { time: optimalWait });
      
      // Get page snapshot
      const snapshot = await mcp.call('browser_snapshot', {});
      
      // Extract data (simplified - would use actual extraction logic)
      const data = { url, snapshot };
      results.push(data);
      
      // Record success
      const duration = Date.now() - startTime;
      await mcp.call('record_metric', {
        operation: 'data_extraction',
        success: true,
        durationMs: duration,
        pattern: 'batch_extraction'
      });
      
    } catch (error) {
      console.error(`Failed to extract from ${url}:`, error);
      
      // AI error analysis
      const analysis = await mcp.call('ai_analyze_error', {
        errorMessage: error.message,
        context: `Extracting data from ${url}`
      });
      
      console.log('Error analysis:', analysis);
      
      // Record failure
      const duration = Date.now() - startTime;
      await mcp.call('record_metric', {
        operation: 'data_extraction',
        success: false,
        durationMs: duration,
        errorMessage: error.message,
        pattern: 'batch_extraction'
      });
    }
  }
  
  // Learn from the batch operation
  const insights = await mcp.call('learn_from_history', {
    lookbackMinutes: 10
  });
  
  console.log('Learned insights:', insights);
  
  return results;
}

// Usage
const urls = [
  'https://example1.com',
  'https://example2.com',
  'https://example3.com'
];

const data = await intelligentDataExtraction(urls);
console.log('Extracted data:', data);
```

---

## Best Practices Summary

1. **Always start with health checks** before critical workflows
2. **Use AI tools** for error analysis and workflow recommendations
3. **Implement retry logic** for operations that may fail transiently
4. **Validate operations** after critical steps
5. **Record metrics** for all operations to enable learning
6. **Monitor analytics** to identify optimization opportunities
7. **Leverage pattern recognition** to improve workflow efficiency
8. **Use auto-reconnect** for resilient long-running automations
9. **Take snapshots** before interacting with dynamic pages
10. **Follow AI recommendations** for optimal automation strategies

---

For more information and API details, see [API.md](./API.md)
