// Socket message map types
export type SocketMessageMap = {
  browser_navigate: { url: string };
  browser_go_back: {};
  browser_go_forward: {};
  browser_wait: { time: number };
  browser_press_key: { key: string };
  browser_get_console_logs: {};
  browser_screenshot: {};
  browser_snapshot: {};
  browser_click: { element: string; ref: string };
  browser_drag: { startElement: string; startRef: string; endElement: string; endRef: string };
  browser_hover: { element: string; ref: string };
  browser_type: { element: string; ref: string; text: string };
  browser_select_option: { element: string; ref: string; values: string[] };
  getUrl: undefined;
  getTitle: undefined;
};
