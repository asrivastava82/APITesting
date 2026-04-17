import { APIRequestContext } from "@playwright/test";
import { APILogger } from "./logger";

export class APIClient {
  private apiLogger: APILogger;
  private request: APIRequestContext;
  private baseURL: string | undefined =
    "https://api.eventhub.rahulshettyacademy.com/api";
  private apiPath: string = "";
  private queryParams: Record<string, string | number> = {};
  private apiHeaders: Record<string, string> = {};
  private apiBody: Record<string, string | number> = {};
  private defaultAuthToken: string;
  private clearAuthFlag: boolean = false;

  constructor(
    request: APIRequestContext,
    apiLogger: APILogger,
    authToken: string = "",
  ) {
    this.request = request;
    this.apiLogger = apiLogger;
    this.defaultAuthToken = authToken;
  }

  url(url: string) {
    this.baseURL = url;
    return this;
  }

  path(path: string) {
    this.apiPath = path;
    return this;
  }

  headers(headers: Record<string, string>) {
    this.apiHeaders = headers;
    return this;
  }

  params(params: Record<string, string | number>) {
    this.queryParams = params;
    return this;
  }

  body(body: Record<string, string | number>) {
    this.apiBody = body;
    return this;
  }

  clearAuth() {
    this.clearAuthFlag = true;
    return this;
  }

  async getRequest() {
    const url = this.getUrl();
    this.apiLogger.logRequest("GET", url, this.getHeaders(), this.apiBody);
    const response = await this.request.get(url, {
      headers: this.getHeaders(),
    });
    this.cleanupfields();
    const reponseJson = await response.json();
    this.apiLogger.logResponse(response.status(), reponseJson);
    return {
      status: response.status(),
      ok: response.ok(),
      body: reponseJson,
    };
  }

  async postRequest() {
    const url = this.getUrl();
    this.apiLogger.logRequest("POST", url, this.getHeaders(), this.apiBody);
    const response = await this.request.post(url, {
      headers: this.getHeaders(),
      data: this.apiBody,
    });
    this.cleanupfields();
    const reponseJson = await response.json();
    this.apiLogger.logResponse(response.status(), reponseJson);
    return {
      status: response.status(),
      ok: response.ok(),
      body: reponseJson,
    };
  }

  async putRequest() {
    const url = this.getUrl();
    this.apiLogger.logRequest("PUT", url, this.getHeaders(), this.apiBody);
    const response = await this.request.put(url, {
      headers: this.getHeaders(),
      data: this.apiBody,
    });
    this.cleanupfields();
    const reponseJson = await response.json();
    this.apiLogger.logResponse(response.status(), reponseJson);
    return {
      status: response.status(),
      ok: response.ok(),
      body: reponseJson,
    };
  }

  async deleteRequest() {
    const url = this.getUrl();
    this.apiLogger.logRequest("DELETE", url, this.getHeaders());
    const response = await this.request.delete(url);
    this.cleanupfields();
    const reponseJson = await response.json();
    this.apiLogger.logResponse(response.status(), reponseJson);
    return {
      status: response.status(),
      ok: response.ok(),
    };
  }

  private getUrl() {
    const url = new URL(`${this.baseURL}${this.apiPath}`);
    for (const [key, value] of Object.entries(this.queryParams)) {
      url.searchParams.append(key, value.toString());
    }
    return url.toString();
  }

  private getHeaders() {
    if (!this.clearAuthFlag && this.defaultAuthToken) {
      this.apiHeaders["Authorization"] =
        this.apiHeaders["Authorization"] || `Bearer ${this.defaultAuthToken}`;
    }
    return this.apiHeaders;
  }

  private cleanupfields() {
    this.baseURL = undefined;
    this.apiPath = "";
    this.queryParams = {};
    this.apiHeaders = {};
    this.apiBody = {};
    this.clearAuthFlag = false;
  }
}
