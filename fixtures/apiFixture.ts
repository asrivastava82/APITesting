import { test as base } from "@playwright/test";
import { APIClient } from "../util/api-client";
import { APILogger } from "../util/logger";

export type TestOptions = {
  api: APIClient;
};

export const test = base.extend<TestOptions>({
  api: async ({ request }, use) => {
    const apiLogger = new APILogger();
    const apiClient = new APIClient(request, apiLogger);
    await use(apiClient);
  },
});

export { expect } from "@playwright/test";
