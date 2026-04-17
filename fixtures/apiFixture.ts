import { test as base } from "@playwright/test";
import { APIClient } from "../util/api-client";
import { APILogger } from "../util/logger";
import { config } from "../util/api-config";
import { createToken } from "../helpers/createToken";

export type TestOptions = {
  api: APIClient;
};

export type WorkerFixture = {
  authToken: string;
};

export const test = base.extend<TestOptions, WorkerFixture>({
  authToken: [
    async ({}, use) => {
      const authToken = await createToken(
        config.userEmail,
        config.userPassword,
      );
      await use(authToken);
    },
    { scope: "worker" },
  ],

  api: async ({ request, authToken }, use) => {
    const apiLogger = new APILogger();

    const apiClient = new APIClient(request, apiLogger, authToken);
    await use(apiClient);
  },
});

export { expect } from "@playwright/test";
