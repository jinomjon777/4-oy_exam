const {Router}=require("express")
const auth=require("../middleware/auth.middleware")

const {getAllTodos,addTodo,updateTodo,toggleTodo,deleteTodo,removeChecked,getStats}=require("../controller/todo.controller")

const todoRouter=Router()

todoRouter.get("/get_all_todo",auth,getAllTodos)
todoRouter.post("/add_todo",auth,addTodo)
todoRouter.put("/update_todo/:id",auth,updateTodo)
todoRouter.patch("/toggle_todo/:id",auth,toggleTodo)
todoRouter.delete("/delete_todo/:id",auth,deleteTodo)
todoRouter.delete("/remove_checked",auth,removeChecked)
todoRouter.get("/stats",auth,getStats)

module.exports=todoRouter
