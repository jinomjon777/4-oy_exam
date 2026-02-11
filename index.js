require("dotenv").config()
const express=require("express")
const cors=require("cors")

const authRouter=require("./router/auth.routes")
const todoRouter=require("./router/todo.routes")

const app=express()

const PORT=process.env.PORT || 3000
app.use(cors())
app.use(express.json()) 

app.use(authRouter)
app.use(todoRouter)

app.listen(PORT, ()=>{
  console.log("Server is running at: ",PORT);
})

