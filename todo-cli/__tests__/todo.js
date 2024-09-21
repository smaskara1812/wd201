/* eslint-disable no-undef */
let todoList = require("../todo");
const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();

describe("Todo test cases", () => {
  beforeEach(() => {
    // Clear all todos before each test to avoid state carryover
    all.length = 0;

    const today = new Date();
    const oneDay = 60 * 60 * 24 * 1000;

    // Setting up initial todos
    [
      {
        title: "Complete assignment",
        completed: false,
        dueDate: new Date(today.getTime() - 1 * oneDay).toLocaleDateString("en-CA"), // Overdue
      },
      {
        title: "Go for shopping",
        completed: false,
        dueDate: new Date().toLocaleDateString("en-CA"), // Due Today
      },
      {
        title: "Complete project",
        completed: false,
        dueDate: new Date(today.getTime() + 1 * oneDay).toLocaleDateString("en-CA"), // Due Later
      },
    ].forEach(add);
  });

  test("Add new todo", () => {
    expect(all.length).toEqual(3); // Initially 3 todos

    add({
      title: "Take the test",
      completed: false,
      dueDate: new Date().toLocaleDateString("en-CA"),
    });

    expect(all.length).toEqual(4); // Now should be 4 todos
  });

  test("Todo mark as complete", () => {
    expect(all[0].completed).toEqual(false);
    markAsComplete(0);
    expect(all[0].completed).toEqual(true);
  });

  test("Retrieve overdue items", () => {
    expect(overdue().length).toEqual(1); // There should be 1 overdue todo
  });

  test("Retrieve due today items", () => {
    expect(dueToday().length).toEqual(2); // There should be 2 todos due today
  });

  test("Retrieve due later items", () => {
    expect(dueLater().length).toEqual(1); // There should be 1 todo due later
  });
});