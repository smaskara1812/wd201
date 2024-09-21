/* eslint-disable no-undef */
let todoList = require("../todo");
const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();

describe("Todo test cases", () => {
  beforeEach(() => {
    // Clear all todos before each test to avoid state carryover
    all.length = 0;

    const today = new Date();
    const oneDay = 60 * 60 * 24 * 1000;

    // Set up test todos
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

  // Test to add a todo
  test("Add new todo", () => {
    expect(all.length).toEqual(3); // Initial count

    add({
      title: "Take the test",
      completed: false,
      dueDate: new Date().toLocaleDateString("en-CA"), // Due Today
    });

    expect(all.length).toEqual(4); // After adding one more
  });

  // Test to mark a todo as complete
  test("Todo mark as complete", () => {
    expect(all[0].completed).toEqual(false); // Initially not completed
    markAsComplete(0);
    expect(all[0].completed).toEqual(true); // Now marked as complete
  });

  // Test to retrieve overdue items
  test("Test for overdue items", () => {
    expect(overdue().length).toEqual(1); // Should have 1 overdue item
    expect(overdue()[0].title).toEqual("Complete assignment"); // Check title
  });

  // Test to retrieve due today items
  test("Test due today items", () => {
    expect(dueToday().length).toEqual(2); // Should have 2 due today
    expect(dueToday()[0].title).toEqual("Go for shopping"); // Check first title
  });

  // Test to retrieve due later items
  test("Test for due later items", () => {
    expect(dueLater().length).toEqual(1); // Should have 1 item due later
    expect(dueLater()[0].title).toEqual("Complete project"); // Check title
  });
});