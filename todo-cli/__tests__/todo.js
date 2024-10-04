/* eslint-disable no-undef */
const db = require("../models");

describe("Todolist Test Suite", () => {
  beforeAll(async () => {
    // Sync the database before running any tests (force:true will drop and recreate tables)
    await db.sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    // Clean up the Todo table before each test to ensure tests run in isolation
    await db.Todo.destroy({ where: {} });
  });

  test("Should add a new todo", async () => {
    const initialTodoCount = await db.Todo.count();
    await db.Todo.create({
      title: "New Task",
      completed: false,
      dueDate: new Date(),
    });
    const newTodoCount = await db.Todo.count();
    expect(newTodoCount).toBe(initialTodoCount + 1);
  });

  test("Should mark a todo as complete", async () => {
    // Create a todo to test marking as complete
    const todo = await db.Todo.create({
      title: "Incomplete Task",
      completed: false,
      dueDate: new Date(),
    });

    // Mark the todo as complete
    todo.completed = true;
    await todo.save();

    // Retrieve the updated todo and check if it's completed
    const updatedTodo = await db.Todo.findByPk(todo.id);
    expect(updatedTodo.completed).toBe(true);
  });

  test("Should retrieve overdue items", async () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await db.Todo.create({
      title: "Overdue Task",
      completed: false,
      dueDate: yesterday,
    });

    const overdueItems = await db.Todo.findAll({
      where: {
        dueDate: { [db.Sequelize.Op.lt]: new Date() }, // Find tasks due before today
        completed: false,
      },
    });

    expect(overdueItems.length).toBe(1);
    expect(overdueItems[0].title).toBe("Overdue Task");
  });

  test("Should retrieve due today items", async () => {
    const today = new Date();
    await db.Todo.bulkCreate([
      { title: "Pay rent", completed: false, dueDate: today },
      { title: "Service Vehicle", completed: true, dueDate: today },
    ]);

    const todayItems = await db.Todo.findAll({
      where: {
        dueDate: today,
      },
    });

    expect(todayItems.length).toBe(2);
    expect(todayItems.map((item) => item.title)).toEqual(
      expect.arrayContaining(["Pay rent", "Service Vehicle"])
    );
  });

  test("Should retrieve due later items", async () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await db.Todo.create({
      title: "Future Task",
      completed: false,
      dueDate: tomorrow,
    });

    const dueLaterItems = await db.Todo.findAll({
      where: {
        dueDate: { [db.Sequelize.Op.gt]: new Date() }, // Find tasks due after today
      },
    });

    expect(dueLaterItems.length).toBe(1);
    expect(dueLaterItems[0].title).toBe("Future Task");
  });
});