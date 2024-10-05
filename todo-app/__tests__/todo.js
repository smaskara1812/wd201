const request = require("supertest");
const db = require("../models/index");
const app = require("../app");

let server, agent;

describe("Todo Application", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (err) {
      console.error(err);
    }
  });

  test("Should create a new todo and return it as JSON via POST /todos", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toMatch(/json/);
    const data = JSON.parse(response.text);
    expect(data.id).toBeDefined();
  });

  test("Should mark a todo as completed when given its ID", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const data = JSON.parse(response.text);
    const todoID = data.id;

    expect(data.completed).toBe(false);

    const completeResponse = await agent
      .put(`/todos/${todoID}/markASCompleted`)
      .send();
    const updatedData = JSON.parse(completeResponse.text);
    expect(updatedData.completed).toBe(true);
  });

  test("Should retrieve all todos from the database via GET /todos", async () => {
    await agent.post("/todos").send({
      title: "Buy xbox",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    await agent.post("/todos").send({
      title: "Buy ps3",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const response = await agent.get("/todos");
    const todos = JSON.parse(response.text);

    expect(todos.length).toBe(4);
    expect(todos[3]["title"]).toBe("Buy ps3");
  });

  test("Should delete a todo by ID and return a boolean response", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy Everything",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const data = JSON.parse(response.text);
    const todoID = data.id;

    const deleteResponse = await agent.delete(`/todos/${todoID}`).send();
    const deleteResult = JSON.parse(deleteResponse.text);
    expect(deleteResult).toBe(true);
  });
});