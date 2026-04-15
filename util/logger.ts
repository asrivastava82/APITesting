export class APILogger {
  private recentLogs: any[] = [];

  logRequest(
    method: string,
    url: string,
    headers: Record<string, string>,
    body?: any,
  ) {
    const logEntry = { method, url, headers, body };
    this.recentLogs.push({ type: "Request Details", data: logEntry });
    //console.log(this.recentLogs);
  }

  logResponse(status: number, body: any) {
    const logEntry = { status, body };
    this.recentLogs.push({ type: "Response Details", data: logEntry });
    //console.log(this.recentLogs);
  }

  getRecentLogs() {
    const log = this.recentLogs
      .map((entry) => {
        return `====${entry.type}====\n${JSON.stringify(entry.data, null, 4)}`;
      })
      .join("\n\n");
    return log;
  }
}
