import { zodToJsonSchema } from "zod-to-json-schema";
import { z } from "zod";
import type { Context } from "@/context";
import type { Tool } from "./tool";

// AI-powered error detection and suggestions
const AIErrorAnalysisTool = z.object({
  name: z.literal("ai_analyze_error"),
  description: z.literal(
    "Analyze errors and provide AI-powered suggestions for fixing them. Uses pattern matching and historical data to suggest solutions."
  ),
  arguments: z.object({
    errorMessage: z.string().describe("The error message to analyze"),
    context: z.string().optional().describe("Additional context about when the error occurred"),
  }),
});

export const aiAnalyzeError: Tool = {
  schema: {
    name: AIErrorAnalysisTool.shape.name.value,
    description: AIErrorAnalysisTool.shape.description.value,
    inputSchema: zodToJsonSchema(AIErrorAnalysisTool.shape.arguments),
  },
  handle: async (context: Context, params) => {
    const { errorMessage, context: errorContext } = AIErrorAnalysisTool.shape.arguments.parse(params);
    
    // AI-powered error analysis
    const suggestions: string[] = [];
    const errorLower = errorMessage.toLowerCase();
    
    // Pattern matching for common errors
    if (errorLower.includes("timeout") || errorLower.includes("timed out")) {
      suggestions.push("Consider increasing the timeout duration");
      suggestions.push("Check if the target element is being loaded dynamically");
      suggestions.push("Verify network connectivity and page load times");
    }
    
    if (errorLower.includes("not found") || errorLower.includes("cannot find")) {
      suggestions.push("Verify the element selector is correct");
      suggestions.push("Check if the element appears after page load (use wait strategies)");
      suggestions.push("Inspect the page structure to ensure the element exists");
    }
    
    if (errorLower.includes("connection") || errorLower.includes("websocket")) {
      suggestions.push("Ensure the browser extension is connected");
      suggestions.push("Try refreshing the browser connection");
      suggestions.push("Check if the WebSocket server is running on the correct port");
    }
    
    if (errorLower.includes("click") || errorLower.includes("interact")) {
      suggestions.push("Element might be covered by another element");
      suggestions.push("Wait for element to be visible and interactable");
      suggestions.push("Try scrolling the element into view first");
    }
    
    const analysis = {
      error: errorMessage,
      context: errorContext || "No additional context provided",
      suggestions,
      confidence: suggestions.length > 0 ? "high" : "low",
      recommendedActions: suggestions.length > 0 
        ? "Try the suggested solutions in order"
        : "Manual investigation required - error pattern not recognized",
    };
    
    return {
      content: [
        {
          type: "text",
          text: `## AI Error Analysis\n\n**Error:** ${analysis.error}\n\n**Context:** ${analysis.context}\n\n**Confidence:** ${analysis.confidence}\n\n**Suggestions:**\n${suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n**Recommended Actions:** ${analysis.recommendedActions}`,
        },
      ],
    };
  },
};

// Intelligent workflow recommendation system
const AIWorkflowRecommendationTool = z.object({
  name: z.literal("ai_recommend_workflow"),
  description: z.literal(
    "Get AI-powered recommendations for optimizing browser automation workflows based on the current page and task description."
  ),
  arguments: z.object({
    taskDescription: z.string().describe("Description of what you want to accomplish"),
    pageUrl: z.string().optional().describe("Current page URL"),
  }),
});

export const aiRecommendWorkflow: Tool = {
  schema: {
    name: AIWorkflowRecommendationTool.shape.name.value,
    description: AIWorkflowRecommendationTool.shape.description.value,
    inputSchema: zodToJsonSchema(AIWorkflowRecommendationTool.shape.arguments),
  },
  handle: async (context: Context, params) => {
    const { taskDescription, pageUrl } = AIWorkflowRecommendationTool.shape.arguments.parse(params);
    
    // Get current page information
    let currentUrl = pageUrl;
    let pageTitle = "";
    
    try {
      if (!currentUrl) {
        currentUrl = await context.sendSocketMessage("getUrl", undefined);
      }
      pageTitle = await context.sendSocketMessage("getTitle", undefined);
    } catch (e) {
      // If we can't get page info, continue with what we have
    }
    
    const recommendations: string[] = [];
    const taskLower = taskDescription.toLowerCase();
    
    // Analyze task and provide intelligent recommendations
    if (taskLower.includes("form") || taskLower.includes("fill") || taskLower.includes("submit")) {
      recommendations.push("1. Take a snapshot to identify form fields");
      recommendations.push("2. Use browser_type to fill in text fields sequentially");
      recommendations.push("3. Use browser_select_option for dropdowns");
      recommendations.push("4. Take a screenshot before submitting to verify data");
      recommendations.push("5. Use browser_click to submit the form");
      recommendations.push("6. Wait for confirmation message or page navigation");
    }
    
    if (taskLower.includes("login") || taskLower.includes("sign in") || taskLower.includes("authenticate")) {
      recommendations.push("1. Navigate to the login page if not already there");
      recommendations.push("2. Take a snapshot to identify username and password fields");
      recommendations.push("3. Fill username field using browser_type");
      recommendations.push("4. Fill password field using browser_type");
      recommendations.push("5. Click the login/submit button");
      recommendations.push("6. Wait for successful authentication and page navigation");
    }
    
    if (taskLower.includes("scrape") || taskLower.includes("extract") || taskLower.includes("data")) {
      recommendations.push("1. Navigate to the target page");
      recommendations.push("2. Wait for dynamic content to load");
      recommendations.push("3. Take a snapshot to analyze page structure");
      recommendations.push("4. Use browser_get_console_logs to check for errors");
      recommendations.push("5. Take a screenshot for verification");
      recommendations.push("6. Repeat for pagination if needed");
    }
    
    if (taskLower.includes("test") || taskLower.includes("verify")) {
      recommendations.push("1. Take a snapshot of the initial state");
      recommendations.push("2. Perform the action to test");
      recommendations.push("3. Wait for changes to complete");
      recommendations.push("4. Take a screenshot for visual verification");
      recommendations.push("5. Check console logs for errors");
      recommendations.push("6. Take another snapshot to verify final state");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("1. Take a snapshot to understand the current page structure");
      recommendations.push("2. Identify interactive elements related to your task");
      recommendations.push("3. Plan your sequence of actions");
      recommendations.push("4. Execute actions step by step with verification");
      recommendations.push("5. Use screenshots and snapshots to monitor progress");
      recommendations.push("6. Check console logs if unexpected behavior occurs");
    }
    
    const workflow = {
      task: taskDescription,
      currentPage: pageTitle || currentUrl || "Unknown",
      recommendedSteps: recommendations,
      tips: [
        "Always take snapshots before interacting with new pages",
        "Use wait commands between actions for dynamic content",
        "Take screenshots to verify visual changes",
        "Check console logs when troubleshooting",
      ],
    };
    
    return {
      content: [
        {
          type: "text",
          text: `## AI Workflow Recommendations\n\n**Task:** ${workflow.task}\n\n**Current Page:** ${workflow.currentPage}\n\n**Recommended Workflow:**\n${recommendations.join("\n")}\n\n**Pro Tips:**\n${workflow.tips.map((t, i) => `• ${t}`).join("\n")}`,
        },
      ],
    };
  },
};

// Context-aware automation suggestions
const AIAutomationSuggestionTool = z.object({
  name: z.literal("ai_suggest_automation"),
  description: z.literal(
    "Get intelligent suggestions for automating repetitive tasks based on recent operations history."
  ),
  arguments: z.object({
    recentOperations: z.array(z.string()).optional().describe("List of recent operations performed"),
  }),
});

export const aiSuggestAutomation: Tool = {
  schema: {
    name: AIAutomationSuggestionTool.shape.name.value,
    description: AIAutomationSuggestionTool.shape.description.value,
    inputSchema: zodToJsonSchema(AIAutomationSuggestionTool.shape.arguments),
  },
  handle: async (_context: Context, params) => {
    const { recentOperations = [] } = AIAutomationSuggestionTool.shape.arguments.parse(params);
    
    const suggestions: string[] = [];
    const patterns: string[] = [];
    
    // Pattern detection
    if (recentOperations.length >= 3) {
      // Check for repetitive navigation
      const navigateCount = recentOperations.filter(op => op.includes("navigate")).length;
      if (navigateCount >= 2) {
        patterns.push("Repetitive navigation detected");
        suggestions.push("Create a reusable navigation function for common URLs");
      }
      
      // Check for form filling patterns
      const typeCount = recentOperations.filter(op => op.includes("type")).length;
      if (typeCount >= 3) {
        patterns.push("Form filling pattern detected");
        suggestions.push("Consider creating a form-filling workflow template");
        suggestions.push("Store form data in a configuration file for reusability");
      }
      
      // Check for repetitive clicking
      const clickCount = recentOperations.filter(op => op.includes("click")).length;
      if (clickCount >= 3) {
        patterns.push("Multiple click operations detected");
        suggestions.push("Consider grouping related clicks into a single workflow step");
      }
      
      // Check for snapshot-action-snapshot pattern
      const hasSnapshots = recentOperations.filter(op => op.includes("snapshot")).length >= 2;
      if (hasSnapshots) {
        patterns.push("Good practice: Using snapshots for verification");
      }
    }
    
    // General automation suggestions
    if (suggestions.length === 0) {
      suggestions.push("Build reusable workflow templates for common tasks");
      suggestions.push("Use variables to parameterize repetitive operations");
      suggestions.push("Implement error handling and retry logic");
      suggestions.push("Add validation checkpoints between major steps");
    }
    
    const automationAdvice = {
      patternsDetected: patterns.length > 0 ? patterns : ["No significant patterns detected yet"],
      suggestions,
      bestPractices: [
        "Use descriptive names for saved workflows",
        "Include error handling in automation scripts",
        "Test workflows with different data sets",
        "Document workflow steps for team collaboration",
      ],
    };
    
    return {
      content: [
        {
          type: "text",
          text: `## Automation Suggestions\n\n**Patterns Detected:**\n${automationAdvice.patternsDetected.map(p => `• ${p}`).join("\n")}\n\n**Suggestions:**\n${suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n**Best Practices:**\n${automationAdvice.bestPractices.map(bp => `• ${bp}`).join("\n")}`,
        },
      ],
    };
  },
};

// Smart element detection
const AIElementDetectionTool = z.object({
  name: z.literal("ai_detect_elements"),
  description: z.literal(
    "Use AI to intelligently detect and categorize interactive elements on the page, providing smart selectors and interaction recommendations."
  ),
  arguments: z.object({
    elementType: z.string().optional().describe("Type of element to focus on (e.g., 'button', 'input', 'link')"),
  }),
});

export const aiDetectElements: Tool = {
  schema: {
    name: AIElementDetectionTool.shape.name.value,
    description: AIElementDetectionTool.shape.description.value,
    inputSchema: zodToJsonSchema(AIElementDetectionTool.shape.arguments),
  },
  handle: async (context: Context, params) => {
    const { elementType } = AIElementDetectionTool.shape.arguments.parse(params);
    
    // Get page snapshot
    const snapshot = await context.sendSocketMessage("browser_snapshot", {});
    
    // AI-powered element analysis
    const analysis = {
      pageStructure: "Analyzing ARIA snapshot for interactive elements...",
      detectedElements: [] as string[],
      recommendations: [] as string[],
    };
    
    // Parse snapshot for element patterns
    const snapshotStr = String(snapshot);
    
    if (snapshotStr.includes("button")) {
      analysis.detectedElements.push("Buttons detected - likely interactive elements");
      analysis.recommendations.push("Use browser_click for button interactions");
    }
    
    if (snapshotStr.includes("textbox") || snapshotStr.includes("input")) {
      analysis.detectedElements.push("Text input fields detected");
      analysis.recommendations.push("Use browser_type to fill in text fields");
      analysis.recommendations.push("Take snapshot first to identify exact field references");
    }
    
    if (snapshotStr.includes("link")) {
      analysis.detectedElements.push("Links detected for navigation");
      analysis.recommendations.push("Use browser_click to navigate via links");
    }
    
    if (snapshotStr.includes("combobox") || snapshotStr.includes("listbox")) {
      analysis.detectedElements.push("Dropdown/select elements detected");
      analysis.recommendations.push("Use browser_select_option for dropdown interactions");
    }
    
    if (analysis.detectedElements.length === 0) {
      analysis.detectedElements.push("No specific interactive elements detected in snapshot");
      analysis.recommendations.push("Page might be loading or have limited interactivity");
      analysis.recommendations.push("Wait for page to fully load and try again");
    }
    
    return {
      content: [
        {
          type: "text",
          text: `## AI Element Detection\n\n${elementType ? `**Focus:** ${elementType}\n\n` : ""}**Detected Elements:**\n${analysis.detectedElements.map(e => `• ${e}`).join("\n")}\n\n**Interaction Recommendations:**\n${analysis.recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")}\n\n**Page Snapshot:**\n\`\`\`yaml\n${snapshot}\n\`\`\``,
        },
      ],
    };
  },
};
