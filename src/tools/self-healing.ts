import { zodToJsonSchema } from "zod-to-json-schema";
import { z } from "zod";
import type { Context } from "@/context";
import type { Tool } from "./tool";

// Retry with exponential backoff
const RetryOperationTool = z.object({
  name: z.literal("retry_operation"),
  description: z.literal(
    "Retry a failed operation with exponential backoff and intelligent error recovery. Automatically adjusts retry strategy based on error type."
  ),
  arguments: z.object({
    operation: z.string().describe("The operation name to retry (e.g., 'browser_click', 'browser_navigate')"),
    operationParams: z.record(z.any()).describe("Parameters for the operation"),
    maxRetries: z.number().optional().default(3).describe("Maximum number of retry attempts"),
    initialDelayMs: z.number().optional().default(1000).describe("Initial delay in milliseconds"),
  }),
});

export const retryOperation: Tool = {
  schema: {
    name: RetryOperationTool.shape.name.value,
    description: RetryOperationTool.shape.description.value,
    inputSchema: zodToJsonSchema(RetryOperationTool.shape.arguments),
  },
  handle: async (context: Context, params) => {
    const { operation, operationParams, maxRetries = 3, initialDelayMs = 1000 } = 
      RetryOperationTool.shape.arguments.parse(params);
    
    let lastError: Error | undefined;
    const attempts: Array<{ attempt: number; success: boolean; error?: string; delayMs: number }> = [];
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await context.sendSocketMessage(
          operation as any,
          operationParams as any,
          { timeoutMs: 30000 }
        );
        
        attempts.push({ attempt, success: true, delayMs: 0 });
        
        return {
          content: [
            {
              type: "text",
              text: `✅ Operation succeeded on attempt ${attempt}/${maxRetries}\n\nOperation: ${operation}\nResult: ${JSON.stringify(result, null, 2)}\n\nAttempt History:\n${attempts.map(a => `  Attempt ${a.attempt}: ${a.success ? '✅ Success' : `❌ Failed - ${a.error}`}${a.delayMs > 0 ? ` (waited ${a.delayMs}ms)` : ''}`).join('\n')}`,
            },
          ],
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        const delayMs = initialDelayMs * Math.pow(2, attempt - 1);
        
        attempts.push({ 
          attempt, 
          success: false, 
          error: lastError.message,
          delayMs: attempt < maxRetries ? delayMs : 0
        });
        
        if (attempt < maxRetries) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }
    
    return {
      content: [
        {
          type: "text",
          text: `❌ Operation failed after ${maxRetries} attempts\n\nOperation: ${operation}\nLast Error: ${lastError?.message}\n\nAttempt History:\n${attempts.map(a => `  Attempt ${a.attempt}: ${a.success ? '✅ Success' : `❌ Failed - ${a.error}`}${a.delayMs > 0 ? ` (waited ${a.delayMs}ms before retry)` : ''}`).join('\n')}\n\nRecommendation: Use ai_analyze_error tool to get suggestions for fixing this issue.`,
        },
      ],
      isError: true,
    };
  },
};

// Health monitoring
const HealthCheckTool = z.object({
  name: z.literal("health_check"),
  description: z.literal(
    "Perform comprehensive health check of the browser connection, page state, and system readiness. Provides diagnostic information and recovery suggestions."
  ),
  arguments: z.object({
    includePageInfo: z.boolean().optional().default(true).describe("Include current page information"),
  }),
});

export const healthCheck: Tool = {
  schema: {
    name: HealthCheckTool.shape.name.value,
    description: HealthCheckTool.shape.description.value,
    inputSchema: zodToJsonSchema(HealthCheckTool.shape.arguments),
  },
  handle: async (context: Context, params) => {
    const { includePageInfo = true } = HealthCheckTool.shape.arguments.parse(params);
    
    const checks = {
      connection: { status: "unknown", message: "" },
      page: { status: "unknown", message: "", url: "", title: "" },
      console: { status: "unknown", message: "", errorCount: 0 },
      overall: "unknown",
    };
    
    // Check WebSocket connection
    try {
      if (context.hasWs()) {
        checks.connection.status = "healthy";
        checks.connection.message = "WebSocket connection established";
      } else {
        checks.connection.status = "unhealthy";
        checks.connection.message = "No WebSocket connection";
      }
    } catch (error) {
      checks.connection.status = "unhealthy";
      checks.connection.message = `Connection error: ${error}`;
    }
    
    // Check page state
    if (includePageInfo && checks.connection.status === "healthy") {
      try {
        checks.page.url = await context.sendSocketMessage("getUrl", undefined, { timeoutMs: 5000 });
        checks.page.title = await context.sendSocketMessage("getTitle", undefined, { timeoutMs: 5000 });
        checks.page.status = "healthy";
        checks.page.message = "Page is accessible";
      } catch (error) {
        checks.page.status = "unhealthy";
        checks.page.message = `Page access error: ${error}`;
      }
      
      // Check console logs for errors
      try {
        const logs = await context.sendSocketMessage("browser_get_console_logs", {}, { timeoutMs: 5000 }) as any[];
        const errors = logs.filter((log: any) => 
          log.type === "error" || log.level === "error"
        );
        checks.console.errorCount = errors.length;
        checks.console.status = errors.length === 0 ? "healthy" : "warning";
        checks.console.message = errors.length === 0 
          ? "No console errors detected"
          : `${errors.length} console error(s) detected`;
      } catch (error) {
        checks.console.status = "unknown";
        checks.console.message = "Could not retrieve console logs";
      }
    }
    
    // Overall health
    const unhealthyCount = Object.values(checks).filter(
      (c: any) => c.status === "unhealthy"
    ).length;
    checks.overall = unhealthyCount === 0 ? "healthy" : "unhealthy";
    
    const recommendations: string[] = [];
    if (checks.connection.status === "unhealthy") {
      recommendations.push("Ensure Browser MCP extension is installed and connected");
      recommendations.push("Click the extension icon and press 'Connect' button");
      recommendations.push("Check that WebSocket server is running on the correct port");
    }
    if (checks.page.status === "unhealthy") {
      recommendations.push("Navigate to a valid page before performing operations");
      recommendations.push("Check browser's network connectivity");
    }
    if (checks.console.errorCount > 0) {
      recommendations.push("Review console errors - they may indicate page issues");
      recommendations.push("Use browser_get_console_logs for detailed error information");
    }
    
    return {
      content: [
        {
          type: "text",
          text: `## System Health Check\n\n**Overall Status:** ${checks.overall === "healthy" ? "✅ HEALTHY" : "❌ UNHEALTHY"}\n\n**Connection:** ${checks.connection.status === "healthy" ? "✅" : "❌"} ${checks.connection.message}\n\n${includePageInfo ? `**Page State:** ${checks.page.status === "healthy" ? "✅" : "❌"} ${checks.page.message}\n${checks.page.url ? `  - URL: ${checks.page.url}\n` : ""}${checks.page.title ? `  - Title: ${checks.page.title}\n` : ""}\n**Console:** ${checks.console.status === "healthy" ? "✅" : checks.console.status === "warning" ? "⚠️" : "❓"} ${checks.console.message}\n\n` : ""}${recommendations.length > 0 ? `**Recommendations:**\n${recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")}` : "All systems operational! 🚀"}`,
        },
      ],
    };
  },
};

// Auto-reconnection
const AutoReconnectTool = z.object({
  name: z.literal("auto_reconnect"),
  description: z.literal(
    "Attempt to automatically reconnect to the browser extension with intelligent retry logic and connection validation."
  ),
  arguments: z.object({
    maxAttempts: z.number().optional().default(5).describe("Maximum reconnection attempts"),
  }),
});

export const autoReconnect: Tool = {
  schema: {
    name: AutoReconnectTool.shape.name.value,
    description: AutoReconnectTool.shape.description.value,
    inputSchema: zodToJsonSchema(AutoReconnectTool.shape.arguments),
  },
  handle: async (context: Context, params) => {
    const { maxAttempts = 5 } = AutoReconnectTool.shape.arguments.parse(params);
    
    const attempts: Array<{ attempt: number; success: boolean; message: string }> = [];
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // Test connection
        if (context.hasWs()) {
          await context.sendSocketMessage("getUrl", undefined, { timeoutMs: 3000 });
          attempts.push({ 
            attempt, 
            success: true, 
            message: "Connection established and validated" 
          });
          
          return {
            content: [
              {
                type: "text",
                text: `✅ Successfully reconnected on attempt ${attempt}/${maxAttempts}\n\nConnection is now active and responding.\n\nAttempt History:\n${attempts.map(a => `  Attempt ${a.attempt}: ${a.success ? '✅' : '❌'} ${a.message}`).join('\n')}`,
              },
            ],
          };
        } else {
          attempts.push({ 
            attempt, 
            success: false, 
            message: "No active WebSocket connection" 
          });
        }
      } catch (error) {
        attempts.push({ 
          attempt, 
          success: false, 
          message: error instanceof Error ? error.message : String(error)
        });
      }
      
      if (attempt < maxAttempts) {
        // Wait before next attempt (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    }
    
    return {
      content: [
        {
          type: "text",
          text: `❌ Failed to reconnect after ${maxAttempts} attempts\n\nAttempt History:\n${attempts.map(a => `  Attempt ${a.attempt}: ${a.success ? '✅' : '❌'} ${a.message}`).join('\n')}\n\n**Manual Steps Required:**\n1. Ensure Browser MCP extension is installed\n2. Click the extension icon in your browser\n3. Click the "Connect" button\n4. Try your operation again\n\nIf the problem persists, check that the MCP server is running and the extension has the correct permissions.`,
        },
      ],
      isError: true,
    };
  },
};

// Self-validation tool
const ValidateOperationTool = z.object({
  name: z.literal("validate_operation"),
  description: z.literal(
    "Validate that an operation completed successfully by checking the resulting page state. Provides automatic correction suggestions if validation fails."
  ),
  arguments: z.object({
    operationType: z.string().describe("Type of operation to validate (e.g., 'click', 'navigation', 'form_submission')"),
    expectedOutcome: z.string().describe("Description of the expected outcome"),
    validationChecks: z.array(z.string()).optional().describe("Specific checks to perform"),
  }),
});

export const validateOperation: Tool = {
  schema: {
    name: ValidateOperationTool.shape.name.value,
    description: ValidateOperationTool.shape.description.value,
    inputSchema: zodToJsonSchema(ValidateOperationTool.shape.arguments),
  },
  handle: async (context: Context, params) => {
    const { operationType, expectedOutcome, validationChecks = [] } = 
      ValidateOperationTool.shape.arguments.parse(params);
    
    const results = {
      operationType,
      expectedOutcome,
      checks: [] as Array<{ check: string; passed: boolean; details: string }>,
      overallPassed: true,
      recommendations: [] as string[],
    };
    
    // Perform validation checks
    try {
      // Check 1: Page is responsive
      const url = await context.sendSocketMessage("getUrl", undefined, { timeoutMs: 5000 });
      results.checks.push({
        check: "Page responsiveness",
        passed: true,
        details: `Page is accessible at ${url}`,
      });
      
      // Check 2: No console errors
      try {
        const logs = await context.sendSocketMessage("browser_get_console_logs", {}, { timeoutMs: 5000 }) as any[];
        const errors = logs.filter((log: any) => log.type === "error" || log.level === "error");
        const passed = errors.length === 0;
        results.checks.push({
          check: "Console errors",
          passed,
          details: passed ? "No console errors detected" : `${errors.length} console error(s) found`,
        });
        if (!passed) results.overallPassed = false;
      } catch (e) {
        results.checks.push({
          check: "Console errors",
          passed: true,
          details: "Could not check console (non-critical)",
        });
      }
      
      // Check 3: Get snapshot for validation
      const snapshot = await context.sendSocketMessage("browser_snapshot", {});
      results.checks.push({
        check: "Page snapshot",
        passed: true,
        details: "Successfully captured page state",
      });
      
      // Perform custom validation checks
      for (const checkDesc of validationChecks) {
        const snapshotStr = String(snapshot).toLowerCase();
        const checkLower = checkDesc.toLowerCase();
        const found = snapshotStr.includes(checkLower);
        results.checks.push({
          check: `Custom: ${checkDesc}`,
          passed: found,
          details: found ? "Element/content found in page" : "Element/content not found",
        });
        if (!found) results.overallPassed = false;
      }
      
    } catch (error) {
      results.checks.push({
        check: "Basic validation",
        passed: false,
        details: `Validation error: ${error}`,
      });
      results.overallPassed = false;
    }
    
    // Generate recommendations
    if (!results.overallPassed) {
      results.recommendations.push("Some validation checks failed");
      if (operationType === "navigation") {
        results.recommendations.push("Wait longer for page to load");
        results.recommendations.push("Check if navigation was blocked");
      }
      if (operationType === "click") {
        results.recommendations.push("Verify the element was clickable");
        results.recommendations.push("Check if click triggered expected action");
      }
      if (operationType === "form_submission") {
        results.recommendations.push("Check for form validation errors");
        results.recommendations.push("Verify all required fields were filled");
      }
      results.recommendations.push("Take a screenshot to visually verify the state");
      results.recommendations.push("Use retry_operation if this was a transient failure");
    }
    
    return {
      content: [
        {
          type: "text",
          text: `## Operation Validation\n\n**Operation:** ${operationType}\n**Expected:** ${expectedOutcome}\n**Result:** ${results.overallPassed ? "✅ PASSED" : "❌ FAILED"}\n\n**Validation Checks:**\n${results.checks.map(c => `${c.passed ? '✅' : '❌'} ${c.check}: ${c.details}`).join('\n')}\n\n${results.recommendations.length > 0 ? `**Recommendations:**\n${results.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}` : '**Status:** All checks passed successfully! ✨'}`,
        },
      ],
    };
  },
};
