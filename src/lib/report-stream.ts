/**
 * Shared SSE framing for the report-generation stream.
 *
 * Report generation measured 61-85s in production. The original design held a
 * single fetch open for the whole wait; when iOS suspended the page (screen
 * lock or app switch) the fetch died client-side and the finished report
 * evaporated, even though the server had returned 200. The route now streams
 * heartbeat ticks while the pipeline runs and delivers the result as the final
 * event. These helpers keep the wire format identical on both ends.
 */

// ─── Event Types ────────────────────────────────────────────────────────────

/** Events emitted by POST /api/generate-report over text/event-stream. */
export type ReportStreamEvent = "tick" | "report" | "error";

/** Heartbeat payload: server-truth elapsed time, sent every ~10s. */
export type ReportStreamTickData = {
  elapsedSeconds: number;
};

/**
 * Terminal failure payload. `permanent` mirrors the route's error
 * classification: true for operator-fixable outages (retired model, revoked
 * key, exhausted credit) where inviting a retry would send the user in a loop.
 */
export type ReportStreamErrorData = {
  error: string;
  permanent: boolean;
};

// ─── Encoding (server) ──────────────────────────────────────────────────────

/** Encode one SSE frame: an event line, a JSON data line, and a blank line. */
export function encodeSseEvent(event: ReportStreamEvent, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

// ─── Decoding (client) ──────────────────────────────────────────────────────

export type SseFrame = {
  event: string;
  data: string;
};

/**
 * Incremental SSE frame parser.
 *
 * Network chunks can split a frame anywhere, so feed this strings produced by
 * a TextDecoder running in streaming mode (which itself handles multi-byte
 * UTF-8 split across chunk boundaries) and it buffers partial frames until the
 * terminating blank line arrives. The server emits LF-only frames; a trailing
 * CR per line is tolerated in case an intermediary normalises to CRLF.
 */
export class SseFrameParser {
  private buffer = "";

  /** Feed decoded text; returns every complete frame it unlocked, in order. */
  push(text: string): SseFrame[] {
    this.buffer += text;
    const frames: SseFrame[] = [];
    let separatorIndex: number;
    while ((separatorIndex = this.buffer.indexOf("\n\n")) !== -1) {
      const rawFrame = this.buffer.slice(0, separatorIndex);
      this.buffer = this.buffer.slice(separatorIndex + 2);
      const frame = parseFrame(rawFrame);
      if (frame) frames.push(frame);
    }
    return frames;
  }
}

function parseFrame(raw: string): SseFrame | null {
  let event = "message";
  const dataLines: string[] = [];

  for (const rawLine of raw.split("\n")) {
    const line = rawLine.endsWith("\r") ? rawLine.slice(0, -1) : rawLine;
    if (line.startsWith("event:")) {
      event = line.slice(6).trimStart();
    } else if (line.startsWith("data:")) {
      // Per the SSE spec, a single leading space after the colon is stripped
      // and multiple data lines are joined with newlines.
      dataLines.push(line.slice(5).replace(/^ /, ""));
    }
    // Comment lines (leading ":") and unknown fields are ignored per spec.
  }

  if (dataLines.length === 0) return null;
  return { event, data: dataLines.join("\n") };
}
