import { request } from "@playwright/test";
import { config } from "../util/api-config";
import { APIClient } from "../util/api-client";
import { APILogger } from "../util/logger";

export async function createToken(email: string, password: string) {
  const context = await request.newContext();
  const api = new APIClient(context, new APILogger());

  try {
    const response = await api
      .url("https://api.eventhub.rahulshettyacademy.com/api")
      .path("/auth/login")
      .body({
        email: config.userEmail,
        password: config.userPassword,
      })
      .postRequest();
    return response.body.token;
  } catch (error) {
    throw new Error("Failed to create token", { cause: error });
  } finally {
    context.dispose();
  }
}
