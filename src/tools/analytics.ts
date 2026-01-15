import { zodToJsonSchema } from "zod-to-json-schema";
import { z } from "zod";
import type { Tool } from "./tool";
import type { Context } from "@/context";

// In-memory storage for analytics (in production, this would be persistent)
interface OperationMetric {
  operation: string;
  timestamp: number;
  success: boolean;
  durationMs: number;
  errorMessage?: string;
}

interface PatternData {
  pattern: string;
  frequency: number;
  successRate: number;
  lastSeen: number;
}

class AnalyticsStore {
  private metrics: OperationMetric[] = [];
  private patterns: Map<string, PatternData> = new Map();
  private readonly MAX_METRICS = 1000;

  addMetric(metric: OperationMetric): void {
    this.metrics.push(metric);
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS);
    }
  }

  recordPattern(pattern: string, success: boolean): void {
    const existing = this.patterns.get(pattern);
    if (existing) {
      existing.frequency++;
      const totalOps = existing.frequency;
      const previousSuccesses = existing.successRate * (totalOps - 1);
      existing.successRate = (previousSuccesses + (success ? 1 : 0)) / totalOps;
      existing.lastSeen = Date.now();
    } else {
      this.patterns.set(pattern, {
        pattern,
        frequency: 1,
        successRate: success ? 1 : 0,
        lastSeen: Date.now(),
      });
    }
  }

  getMetrics(limit?: number): OperationMetric[] {
    return limit ? this.metrics.slice(-limit) : this.metrics;
  }

  getPatterns(): PatternData[] {
    return Array.from(this.patterns.values()).sort((a, b) => b.frequency - a.frequency);
  }

  getSuccessRate(operation?: string): number {
    const relevantMetrics = operation
      ? this.metrics.filter(m => m.operation === operation)
      : this.metrics;
    
    if (relevantMetrics.length === 0) return 0;
    const successes = relevantMetrics.filter(m => m.success).length;
    return successes / relevantMetrics.length;
  }

  getAverageDuration(operation?: string): number {
    const relevantMetrics = operation
      ? this.metrics.filter(m => m.operation === operation)
      : this.metrics;
    
    if (relevantMetrics.length === 0) return 0;
    const totalDuration = relevantMetrics.reduce((sum, m) => sum + m.durationMs, 0);
    return totalDuration / relevantMetrics.length;
  }
}

const analyticsStore = new AnalyticsStore();

// Record operation metric
const RecordMetricTool = z.object({
  name: z.literal("record_metric"),
  description: z.literal(
    "Record performance and success metrics for an operation. This data is used for analytics and learning."
  ),
  arguments: z.object({
    operation: z.string().describe("Operation name"),
    success: z.boolean().describe("Whether the operation succeeded"),
    durationMs: z.number().describe("Duration in milliseconds"),
    errorMessage: z.string().optional().describe("Error message if failed"),
    pattern: z.string().optional().describe("Pattern identifier for this operation type"),
  }),
});

export const recordMetric: Tool = {
  schema: {
    name: RecordMetricTool.shape.name.value,
    description: RecordMetricTool.shape.description.value,
    inputSchema: zodToJsonSchema(RecordMetricTool.shape.arguments),
  },
  handle: async (_context: Context, params) => {
    const { operation, success, durationMs, errorMessage, pattern } = 
      RecordMetricTool.shape.arguments.parse(params);
    
    analyticsStore.addMetric({
      operation,
      timestamp: Date.now(),
      success,
      durationMs,
      errorMessage,
    });
    
    if (pattern) {
      analyticsStore.recordPattern(pattern, success);
    }
    
    return {
      content: [
        {
          type: "text",
          text: `✅ Metric recorded\n\nOperation: ${operation}\nSuccess: ${success}\nDuration: ${durationMs}ms${errorMessage ? `\nError: ${errorMessage}` : ""}${pattern ? `\nPattern: ${pattern}` : ""}`,
        },
      ],
    };
  },
};

// Get analytics report
const GetAnalyticsTool = z.object({
  name: z.literal("get_analytics"),
  description: z.literal(
    "Get comprehensive analytics report including success rates, performance metrics, and learned patterns."
  ),
  arguments: z.object({
    operation: z.string().optional().describe("Filter by specific operation"),
    includePatterns: z.boolean().optional().default(true).describe("Include pattern analysis"),
  }),
});

export const getAnalytics: Tool = {
  schema: {
    name: GetAnalyticsTool.shape.name.value,
    description: GetAnalyticsTool.shape.description.value,
    inputSchema: zodToJsonSchema(GetAnalyticsTool.shape.arguments),
  },
  handle: async (_context: Context, params) => {
    const { operation, includePatterns = true } = GetAnalyticsTool.shape.arguments.parse(params);
    
    const metrics = analyticsStore.getMetrics();
    const successRate = analyticsStore.getSuccessRate(operation);
    const avgDuration = analyticsStore.getAverageDuration(operation);
    const patterns = includePatterns ? analyticsStore.getPatterns() : [];
    
    const operationFilter = operation ? ` for '${operation}'` : '';
    const totalOps = operation 
      ? metrics.filter(m => m.operation === operation).length 
      : metrics.length;
    
    let report = `## Analytics Report${operationFilter}\n\n`;
    report += `**Total Operations:** ${totalOps}\n`;
    report += `**Success Rate:** ${(successRate * 100).toFixed(1)}%\n`;
    report += `**Average Duration:** ${avgDuration.toFixed(0)}ms\n\n`;
    
    if (totalOps > 0) {
      const recentMetrics = metrics.slice(-10);
      report += `**Recent Operations:**\n`;
      recentMetrics.forEach((m, i) => {
        report += `${i + 1}. ${m.operation} - ${m.success ? '✅' : '❌'} (${m.durationMs}ms)${m.errorMessage ? ` - ${m.errorMessage}` : ''}\n`;
      });
      report += '\n';
    }
    
    if (includePatterns && patterns.length > 0) {
      report += `**Learned Patterns (Top 10):**\n`;
      patterns.slice(0, 10).forEach((p, i) => {
        report += `${i + 1}. ${p.pattern} - Used ${p.frequency}x, ${(p.successRate * 100).toFixed(1)}% success\n`;
      });
      report += '\n';
    }
    
    // Insights
    report += `**Insights:**\n`;
    if (successRate < 0.7) {
      report += `⚠️ Low success rate detected. Consider reviewing failed operations and using retry strategies.\n`;
    } else if (successRate >= 0.95) {
      report += `✨ Excellent success rate! Operations are performing reliably.\n`;
    } else {
      report += `✅ Good success rate. Minor improvements possible.\n`;
    }
    
    if (avgDuration > 5000) {
      report += `⚠️ High average duration. Consider optimizing operations or checking network conditions.\n`;
    } else if (avgDuration < 1000) {
      report += `⚡ Fast operations! Performance is excellent.\n`;
    }
    
    if (patterns.length > 5) {
      report += `📊 ${patterns.length} patterns identified. System is learning effectively.\n`;
    }
    
    return {
      content: [
        {
          type: "text",
          text: report,
        },
      ],
    };
  },
};

// Learn from history
const LearnFromHistoryTool = z.object({
  name: z.literal("learn_from_history"),
  description: z.literal(
    "Analyze operation history to identify successful patterns, common failures, and optimization opportunities."
  ),
  arguments: z.object({
    lookbackMinutes: z.number().optional().default(60).describe("How far back to analyze (in minutes)"),
  }),
});

export const learnFromHistory: Tool = {
  schema: {
    name: LearnFromHistoryTool.shape.name.value,
    description: LearnFromHistoryTool.shape.description.value,
    inputSchema: zodToJsonSchema(LearnFromHistoryTool.shape.arguments),
  },
  handle: async (_context: Context, params) => {
    const { lookbackMinutes = 60 } = LearnFromHistoryTool.shape.arguments.parse(params);
    
    const cutoffTime = Date.now() - (lookbackMinutes * 60 * 1000);
    const recentMetrics = analyticsStore.getMetrics().filter(m => m.timestamp >= cutoffTime);
    
    if (recentMetrics.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No operations recorded in the last ${lookbackMinutes} minutes. Start using the browser automation tools to build learning data.`,
          },
        ],
      };
    }
    
    // Analyze patterns
    const operationCounts = new Map<string, { total: number; success: number; failed: number }>();
    const errorPatterns = new Map<string, number>();
    
    recentMetrics.forEach(m => {
      const counts = operationCounts.get(m.operation) || { total: 0, success: 0, failed: 0 };
      counts.total++;
      if (m.success) {
        counts.success++;
      } else {
        counts.failed++;
        if (m.errorMessage) {
          const errorType = m.errorMessage.split(':')[0];
          errorPatterns.set(errorType, (errorPatterns.get(errorType) || 0) + 1);
        }
      }
      operationCounts.set(m.operation, counts);
    });
    
    let report = `## Learning Analysis (Last ${lookbackMinutes} minutes)\n\n`;
    report += `**Total Operations Analyzed:** ${recentMetrics.length}\n\n`;
    
    report += `**Operation Breakdown:**\n`;
    Array.from(operationCounts.entries())
      .sort((a, b) => b[1].total - a[1].total)
      .forEach(([op, counts]) => {
        const successRate = (counts.success / counts.total * 100).toFixed(1);
        report += `• ${op}: ${counts.total} ops, ${successRate}% success\n`;
      });
    report += '\n';
    
    if (errorPatterns.size > 0) {
      report += `**Common Error Types:**\n`;
      Array.from(errorPatterns.entries())
        .sort((a, b) => b[1] - a[1])
        .forEach(([error, count]) => {
          report += `• ${error}: ${count} occurrence(s)\n`;
        });
      report += '\n';
    }
    
    // Learning insights
    report += `**Learning Insights:**\n`;
    const topOperations = Array.from(operationCounts.entries())
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 3);
    
    if (topOperations.length > 0) {
      report += `✅ Most used operations: ${topOperations.map(([op]) => op).join(', ')}\n`;
    }
    
    const problematicOps = Array.from(operationCounts.entries())
      .filter(([_, counts]) => counts.failed / counts.total > 0.3)
      .sort((a, b) => (b[1].failed / b[1].total) - (a[1].failed / a[1].total));
    
    if (problematicOps.length > 0) {
      report += `⚠️ Operations with high failure rates: ${problematicOps.map(([op, counts]) => 
        `${op} (${(counts.failed / counts.total * 100).toFixed(0)}% failure)`
      ).join(', ')}\n`;
      report += `  Recommendation: Use retry_operation and validate_operation tools\n`;
    }
    
    const fastOps = recentMetrics.filter(m => m.durationMs < 500);
    if (fastOps.length > 0) {
      report += `⚡ ${fastOps.length} fast operations (< 500ms) identified - these are efficient\n`;
    }
    
    const slowOps = recentMetrics.filter(m => m.durationMs > 5000);
    if (slowOps.length > 0) {
      report += `🐌 ${slowOps.length} slow operations (> 5s) detected - consider optimization\n`;
    }
    
    return {
      content: [
        {
          type: "text",
          text: report,
        },
      ],
    };
  },
};

// Pattern recognition
const RecognizePatternTool = z.object({
  name: z.literal("recognize_pattern"),
  description: z.literal(
    "Identify if the current sequence of operations matches a known successful pattern and provide recommendations."
  ),
  arguments: z.object({
    currentSequence: z.array(z.string()).describe("Current sequence of operations"),
  }),
});

export const recognizePattern: Tool = {
  schema: {
    name: RecognizePatternTool.shape.name.value,
    description: RecognizePatternTool.shape.description.value,
    inputSchema: zodToJsonSchema(RecognizePatternTool.shape.arguments),
  },
  handle: async (_context: Context, params) => {
    const { currentSequence } = RecognizePatternTool.shape.arguments.parse(params);
    
    const patterns = analyticsStore.getPatterns();
    const sequenceStr = currentSequence.join(' -> ');
    
    // Find similar patterns
    const similarPatterns = patterns.filter(p => 
      currentSequence.some(op => p.pattern.includes(op))
    );
    
    let report = `## Pattern Recognition\n\n`;
    report += `**Current Sequence:**\n${currentSequence.map((op, i) => `${i + 1}. ${op}`).join('\n')}\n\n`;
    
    if (similarPatterns.length > 0) {
      report += `**Similar Known Patterns:**\n`;
      similarPatterns.slice(0, 5).forEach((p, i) => {
        report += `${i + 1}. ${p.pattern}\n`;
        report += `   Used ${p.frequency}x, ${(p.successRate * 100).toFixed(1)}% success rate\n`;
      });
      report += '\n';
      
      const bestPattern = similarPatterns.sort((a, b) => 
        (b.successRate * b.frequency) - (a.successRate * a.frequency)
      )[0];
      
      report += `**Recommendation:**\n`;
      if (bestPattern.successRate > 0.8) {
        report += `✅ Your current approach aligns with successful pattern: "${bestPattern.pattern}"\n`;
        report += `This pattern has a ${(bestPattern.successRate * 100).toFixed(1)}% success rate.\n`;
      } else {
        report += `⚠️ Similar patterns found but with lower success rates.\n`;
        report += `Consider reviewing approach or using retry mechanisms.\n`;
      }
    } else {
      report += `**No Similar Patterns Found**\n\n`;
      report += `This appears to be a new operation sequence. The system will learn from this execution.\n`;
      report += `\n**Recommendations:**\n`;
      report += `• Use validate_operation to verify success\n`;
      report += `• Record metrics with record_metric to help the system learn\n`;
      report += `• Consider using retry_operation for resilience\n`;
    }
    
    return {
      content: [
        {
          type: "text",
          text: report,
        },
      ],
    };
  },
};

// Performance optimization suggestions
const OptimizationSuggestionTool = z.object({
  name: z.literal("get_optimization_suggestions"),
  description: z.literal(
    "Get AI-powered suggestions for optimizing operation performance based on historical data and patterns."
  ),
  arguments: z.object({}),
});

export const getOptimizationSuggestions: Tool = {
  schema: {
    name: OptimizationSuggestionTool.shape.name.value,
    description: OptimizationSuggestionTool.shape.description.value,
    inputSchema: zodToJsonSchema(OptimizationSuggestionTool.shape.arguments),
  },
  handle: async (_context: Context) => {
    const metrics = analyticsStore.getMetrics();
    const patterns = analyticsStore.getPatterns();
    
    if (metrics.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No performance data available yet. Start using browser automation operations to collect data for optimization analysis.",
          },
        ],
      };
    }
    
    const suggestions: string[] = [];
    const avgDuration = analyticsStore.getAverageDuration();
    const successRate = analyticsStore.getSuccessRate();
    
    // Performance-based suggestions
    if (avgDuration > 3000) {
      suggestions.push("**Reduce Operation Duration:**");
      suggestions.push("  • Add explicit waits instead of fixed delays");
      suggestions.push("  • Use health_check before operations to ensure readiness");
      suggestions.push("  • Consider batching similar operations");
    }
    
    // Reliability suggestions
    if (successRate < 0.9) {
      suggestions.push("**Improve Reliability:**");
      suggestions.push("  • Use retry_operation for operations with transient failures");
      suggestions.push("  • Add validate_operation after critical steps");
      suggestions.push("  • Use health_check to verify system state before operations");
    }
    
    // Pattern-based suggestions
    const frequentPatterns = patterns.filter(p => p.frequency >= 3);
    if (frequentPatterns.length > 0) {
      suggestions.push("**Workflow Optimization:**");
      const topPattern = frequentPatterns[0];
      suggestions.push(`  • Most frequent pattern: "${topPattern.pattern}" (${topPattern.frequency}x)`);
      if (topPattern.successRate < 1.0) {
        suggestions.push(`  • This pattern has ${((1 - topPattern.successRate) * 100).toFixed(1)}% failure rate - investigate and improve`);
      }
      suggestions.push("  • Consider creating reusable workflow templates");
    }
    
    // Best practices
    suggestions.push("**Best Practices:**");
    suggestions.push("  • Use snapshots before interactions to verify page state");
    suggestions.push("  • Record metrics for continuous learning");
    suggestions.push("  • Implement error handling at workflow level");
    suggestions.push("  • Use AI tools (ai_analyze_error, ai_recommend_workflow) for guidance");
    
    let report = `## Optimization Suggestions\n\n`;
    report += `**Current Performance:**\n`;
    report += `• Average Duration: ${avgDuration.toFixed(0)}ms\n`;
    report += `• Success Rate: ${(successRate * 100).toFixed(1)}%\n`;
    report += `• Operations Tracked: ${metrics.length}\n`;
    report += `• Patterns Learned: ${patterns.length}\n\n`;
    report += suggestions.join('\n');
    
    return {
      content: [
        {
          type: "text",
          text: report,
        },
      ],
    };
  },
};
