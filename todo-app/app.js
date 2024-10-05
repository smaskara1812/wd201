const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
app.use(bodyParser.json());

app.set("view engine", "ejs");

app.get("/",async (request, response) =>{
  const allTodos = await Todo.getTodos();
  if(request.accepts("html")){
    response.render('index', {
      allTodos
    });
  }else{
    response.json({
      allTodos
    })
  }
})

app.use(express.static(path.join(__dirname,'public')));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/todos", async (req, res) => {
  console.log("Fetching all Todos ...");
  try {
    const todosList = await Todo.findAll();
    return res.send(todosList);
  } catch (err) {
    console.error(err);
    return res.status(422).json(err);
  }
});

app.get("/todos/:id", async (req, res) => {
  try {
    const todoItem = await Todo.findByPk(req.params.id);
    return res.json(todoItem);
  } catch (err) {
    console.error(err);
    return res.status(422).json(err);
  }
});

app.post("/todos", async (req, res) => {
  try {
    const newTodo = await Todo.addTodo(req.body);
    return res.json(newTodo);
  } catch (err) {
    console.error(err);
    return res.status(422).json(err);
  }
});

app.put("/todos/:id/markAsCompleted", async (req, res) => {
  const todoItem = await Todo.findByPk(req.params.id);
  try {
    const completedTodo = await todoItem.markAsCompleted();
    return res.json(completedTodo);
  } catch (err) {
    console.error(err);
    return res.status(422).json(err);
  }
});

app.delete("/todos/:id", async (req, res) => {
  console.log("Attempting to delete Todo with ID: ", req.params.id);
  const isDeleted = await Todo.destroy({ where: { id: req.params.id } });
  res.send(isDeleted ? true : false);
});

module.exports = app;