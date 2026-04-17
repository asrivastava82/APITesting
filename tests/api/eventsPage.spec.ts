import { test, expect } from "../../fixtures/apiFixture";
import { config } from "../../util/api-config";

test("Get the list of all events", async ({ api }) => {
  const response = await api
    .url("https://api.eventhub.rahulshettyacademy.com/api")
    .path("/events")
    .getRequest();
  expect(response.status).toBe(200);
  expect(response.ok).toBeTruthy();
  console.log(response.body);
});

test("Add an events", async ({ api }) => {
  const response = await api
    .path("/events")
    .body({
      title: "Tech Summit 2026",
      description: "A premier technology conference.",
      category: "Conference",
      venue: "Bangalore International Centre",
      city: "Bangalore",
      eventDate: "2026-06-15T09:00:00.000Z",
      price: 1500,
      totalSeats: 500,
      imageUrl: "https://example.com/banner.jpg",
    })
    .postRequest();
  expect(response.status).toBe(201);
  console.log(response.body);
});
