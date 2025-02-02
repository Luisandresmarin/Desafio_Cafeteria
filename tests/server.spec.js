const request = require("supertest");
const app = require("../index");

jest.setTimeout(10000); 

describe("GET /cafes", () => {
  it("Debería devolver un status 200 y un array con al menos un objeto", async () => {
    const response = await request(app).get("/cafes").send();
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

describe("DELETE /cafes/:id", () => {
  it("Debería devolver un status 404 si el ID no existe", async () => {
    const idInexistente = 9999;
    const response = await request(app).delete(`/cafes/${idInexistente}`)
    .set("Authorization", "Bearer token_valido")
    .send();
    expect(response.status).toBe(404);
  });
});

describe("POST /cafes", () => {
  it("Debería agregar un nuevo café y devolver un status 201", async () => {
    const nuevoCafe = { id: 8, nombre: "Latte" }; 
    const response = await request(app).post("/cafes").send(nuevoCafe);
    expect(response.status).toBe(201);
    expect(response.body).toContainEqual(nuevoCafe);
  });
});

describe("PUT /cafes/:id", () => {
  it("Debería devolver un status 400 si los IDs no coinciden", async () => {
    const idUrl = 1;
    const payload = { id: 2, nombre: "Cappuccino" }; 
    const response = await request(app).put(`/cafes/${idUrl}`).send(payload);
    expect(response.status).toBe(400);
  });
});
