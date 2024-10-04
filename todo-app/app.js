const express = require('express')
const app = express()
const {Todo} = require("./models")
const bodyparser = require('body-parser')
app.use(bodyparser.json());


app.get("/todos", (request, response) => {
   // response.send("hello world")
   console.log("Todo list")

})

app.post("/todos", async (request, response) => {
    console.log("Creating a Todo", request.body)
    //Todo
    try{
    const todo = await Todo.addTodo({ title: request.body.title, dueDate: request.body.dueDate,  completed: false})
    return response.json(todo)
    }
    catch(error){
        console.log(error)
        return response.status(422).json(error)
    }
 })
app.put("/todos/:id/markAsCompleted", async (request, response) => {
    console.log("we have to update a todo with id:", request.params.id)
    const todo=await Todo.findByPk(request.params.id)
    try{
    const updatedTodo = await todo.markAsCompleted()
    return response.json(updatedTodo)
    } catch(error){
        console.log(error)
        return response.status(422).json(error)
    }
})
app.delete("/todos/:id", (request, response) => {
    console.log("Delete a todo with id:", request.params.id)
})

module.exports = app;