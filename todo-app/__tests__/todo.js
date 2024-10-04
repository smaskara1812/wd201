const request = require("supertest");
const db = require("../models/index");
const app = require("../app");

let server, agent;

describe("todo test suite", () => {
  beforeAll(async () => {
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  test("responds with json at /todos", async () => {
    const response = await agent.post("/todos").send({
      title: "buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });

    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toBe(
      "application/json; charset=utf-8"
    );

    const parsedResponse = JSON.parse(response.text);
    expect(parsedResponse.id).toBeDefined();
  });

  test("Mark a Todo as Complete", async () => {
    const response = await agent.post("/todos").send({
      title: "buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const parsedResponse = JSON.parse(response.text);
    const todoID = parsedResponse.id;

    expect(parsedResponse.completed).toBe(false);

    const markCompletedResponse = await agent
      .put(`/todos/${todoID}/markAsCompleted`)
      .send();
    const parsedUpdateResponse = JSON.parse(markCompletedResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });
});
