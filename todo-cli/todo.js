const todoList = () => {
    let all = [];
  
    const add = (todoItem) => {
      all.push(todoItem);
    };
  
    const markAsComplete = (index) => {
      if (index >= 0 && index < all.length) {
        all[index].completed = true;
      }
    };
  
    const overdue = () => {
      return all.filter((item) => item.dueDate < today && !item.completed);
    };
  
    const dueToday = () => {
      return all.filter((item) => item.dueDate === today);
    };
  
    const dueLater = () => {
      return all.filter((item) => item.dueDate > today);
    };
  
    const toDisplayableList = (list) => {
      return list
        .map((item) => {
          let checkbox = item.completed ? "[x]" : "[ ]";
          let displayDate = item.dueDate === today ? "" : item.dueDate;
          return `${checkbox} ${item.title} ${displayDate}`.trim();
        })
        .join("\n");
    };
  
    return {
      all,
      add,
      markAsComplete,
      overdue,
      dueToday,
      dueLater,
      toDisplayableList,
    };
  };
  
  // ####################################### #
  // DO NOT CHANGE ANYTHING BELOW THIS LINE. #
  // ####################################### #
  
  const todos = todoList();
  
  const formattedDate = (d) => {
    return d.toISOString().split("T")[0];
  };
  
  let date = new Date();
  const today = formattedDate(date);
  const yesterday = formattedDate(new Date(date.setDate(date.getDate() - 1)));
  const tomorrow = formattedDate(new Date(date.setDate(date.getDate() + 2)));
  
  todos.add({ title: "Submit assignment", dueDate: yesterday, completed: false });
  todos.add({ title: "Pay rent", dueDate: today, completed: true });
  todos.add({ title: "Service Vehicle", dueDate: today, completed: false });
  todos.add({ title: "File taxes", dueDate: tomorrow, completed: false });
  todos.add({ title: "Pay electric bill", dueDate: tomorrow, completed: false });
  
  console.log("My Todo-list\n");
  
  console.log("Overdue");
  let overdueItems = todos.overdue();
  console.log(todos.toDisplayableList(overdueItems));
  
  console.log("\nDue Today");
  let todayItems = todos.dueToday();
  console.log(todos.toDisplayableList(todayItems));
  
  console.log("\nDue Later");
  let laterItems = todos.dueLater();
  console.log(todos.toDisplayableList(laterItems));