const request = require("supertest");
const app = require("../src/server");
const prisma = require("../src/db");

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Notes API validation", () => {
  test("POST /api/notes returns 400 when title and content are empty", async () => {
    const response = await request(app)
      .post("/api/notes")
      .send({
        title: "",
        content: "",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("A cím és a tartalom megadása kötelező.");
  });

  test("PUT /api/notes/:id returns 400 when id is invalid", async () => {
    const response = await request(app)
      .put("/api/notes/invalid-id")
      .send({
        title: "Teszt cím",
        content: "Teszt tartalom",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Érvénytelen jegyzet azonosító.");
  });
});