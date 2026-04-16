import { test, expect } from "../../fixtures/apiFixture";
import { createToken } from "../../helpers/createToken";
import { config } from "../../util/api-config";

let authToken: string;

test.describe("Login API flow", () => {
  test.beforeAll("Login test with valid credentials", async ({ api }) => {
    // const response = await api
    //   .url("https://api.eventhub.rahulshettyacademy.com/api")
    //   .path("/auth/login")
    //   .body({
    //     email: config.userEmail,
    //     password: config.userPassword,
    //   })
    //   .postRequest();
    // expect(response.status).toBe(200);
    // expect(response.ok).toBeTruthy();
    authToken = await createToken(config.userEmail, config.userPassword);
  });

  test("Get the authenticated user details", async ({ api }) => {
    const response = await api
      .url("https://api.eventhub.rahulshettyacademy.com/api")
      .path("/auth/me")
      .headers({ Authorization: `Bearer ${authToken}` })
      .getRequest();
    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
  });

  test("Display the message for unauthorized user details", async ({ api }) => {
    const response = await api
      .url("https://api.eventhub.rahulshettyacademy.com/api")
      .path("/auth/me")
      .headers({ Authorization: `${authToken}` })
      .getRequest();
    expect(response.status).toBe(401);
    expect(response.body.error).toContain("Unauthorized");
  });

  test("Display the message for expired or invalid token", async ({ api }) => {
    const response = await api
      .url("https://api.eventhub.rahulshettyacademy.com/api")
      .path("/auth/me")
      .headers({ Authorization: `Bearer ${authToken + "test"}` })
      .getRequest();
    expect(response.status).toBe(401);
    expect(response.body.error).toContain("Invalid or expired token");
  });
});

test("Login test with valid username and invalid password", async ({ api }) => {
  const response = await api
    .path("/auth/login")
    .body({
      email: config.userEmail,
      password: config.userWrongPassword,
    })
    .postRequest();
  expect(response.status).toBe(400);
  expect(response.body.error).toContain("Invalid email or password");
});

test("Login test with invalid username and valid password", async ({ api }) => {
  const response = await api
    .path("/auth/login")
    .body({
      email: config.userWrongEmail,
      password: config.userPassword,
    })
    .postRequest();
  expect(response.status).toBe(400);
  expect(response.body.error).toContain("Invalid email or password");
});
