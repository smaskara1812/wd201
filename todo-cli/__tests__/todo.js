const todoList = require("../todo"); // Adjust this path if necessary

describe("Todo List Test Suite", () => {
  let todos;
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  beforeEach(() => {
    todos = todoList();
    todos.add({ title: "Submit assignment", dueDate: yesterday, completed: false });
    todos.add({ title: "Pay rent", dueDate: today, completed: true });
    todos.add({ title: "Service Vehicle", dueDate: today, completed: false });
    todos.add({ title: "File taxes", dueDate: tomorrow, completed: false });
  });

  test("Should add a new todo", () => {
    const initialLength = todos.all.length;
    todos.add({ title: "New Task", dueDate: tomorrow, completed: false });
    expect(todos.all.length).toBe(initialLength + 1);
    expect(todos.all[initialLength].title).toBe("New Task");
  });

  test("Should mark a todo as complete", () => {
    todos.markAsComplete(2);
    expect(todos.all[2].completed).toBe(true);
  });

  test("Should retrieve overdue items", () => {
    const overdueItems = todos.overdue();
    expect(overdueItems.length).toBe(1);
    expect(overdueItems[0].title).toBe("Submit assignment");
  });

  test("Should retrieve due today items", () => {
    const todayItems = todos.dueToday();
    expect(todayItems.length).toBe(2);
    expect(todayItems.map((item) => item.title)).toEqual(
      expect.arrayContaining(["Pay rent", "Service Vehicle"])
    );
  });

  test("Should retrieve due later items", () => {
    const dueLaterItems = todos.dueLater();
    expect(dueLaterItems.length).toBe(1);
    expect(dueLaterItems[0].title).toBe("File taxes");
  });
});