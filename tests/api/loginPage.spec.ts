import { test, expect } from "../../fixtures/apiFixture";
import { config } from "../../util/api-config";

test("Get the authenticated user details", async ({ api }) => {
  const response = await api
    .url("https://api.eventhub.rahulshettyacademy.com/api")
    .path("/auth/me")
    .getRequest();
  expect(response.status).toBe(200);
  expect(response.ok).toBeTruthy();
});

test("Display the message for unauthorized user details", async ({ api }) => {
  const response = await api
    .url("https://api.eventhub.rahulshettyacademy.com/api")
    .path("/auth/me")
    .clearAuth()
    .getRequest();
  expect(response.status).toBe(401);
  expect(response.body.error).toContain("Unauthorized");
});

test("Display the message for expired or invalid token", async ({ api }) => {
  const response = await api
    .url("https://api.eventhub.rahulshettyacademy.com/api")
    .path("/auth/me")
    .clearAuth()
    .headers({ Authorization: "Bearer invalidtoken" })
    .getRequest();
  expect(response.status).toBe(401);
  expect(response.body.error).toContain("Invalid or expired token");
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
