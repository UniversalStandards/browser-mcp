import type { WebSocket } from "ws";
import type { MessagePayload, MessageType } from "@repo/messaging/types";

export function createSocketMessageSender<T extends Record<string, any>>(ws: WebSocket) {
  return {
    async sendSocketMessage<K extends MessageType<T>>(
      type: K,
      payload: MessagePayload<T, K>,
      options: { timeoutMs?: number } = {},
    ): Promise<any> {
      const { timeoutMs = 30000 } = options;
      
      return new Promise((resolve, reject) => {
        const messageId = Math.random().toString(36).substring(7);
        const message = JSON.stringify({ type, payload, messageId });
        
        const timeout = setTimeout(() => {
          reject(new Error(`Message timeout: ${String(type)}`));
        }, timeoutMs);
        
        const handleMessage = (data: WebSocket.Data) => {
          try {
            const response = JSON.parse(data.toString());
            if (response.messageId === messageId) {
              clearTimeout(timeout);
              ws.off("message", handleMessage);
              if (response.error) {
                reject(new Error(response.error));
              } else {
                resolve(response.result);
              }
            }
          } catch (e) {
            // Ignore parse errors for other messages
          }
        };
        
        ws.on("message", handleMessage);
        ws.send(message, (err) => {
          if (err) {
            clearTimeout(timeout);
            ws.off("message", handleMessage);
            reject(err);
          }
        });
      });
    },
  };
}
