const {v4}=require("uuid")
const {read_file,write_file}=require("../api/file-system")


const getAllTodos=async(req,res)=>{
  try{
    const todo=read_file("todo.json")

    const myTodo=todo.filter((item)=>item.added_by===req.user.id)

    res.status(200).json(myTodo)

  }catch(error){
    return res.status(500).json({
      message:error.message
    })
  }
}


const addTodo=async(req,res)=>{
  try{
    const {title,time}=req.body


    const todo=read_file("todo.json")

    todo.push({
      id:v4(),
      title,
      time,
      done:false,
      added_by:req.user.id
    })

    write_file("todo.json",todo)

    updateStats(req.user.id)

    return res.status(201).json({
      message:"Added"
    })

  }catch(error){
    return res.status(500).json({
      message:error.message
    })
  }
}


const updateTodo=async(req,res)=>{
  try{
    const {id}=req.params
    const {title,time}=req.body

    const todo=read_file("todo.json")

    const foundedTodo=todo.find((item)=>item.id===id)

    if(!foundedTodo){
      return res.status(404).json({
        message:"Not found"
      })
    }

    if(foundedTodo.added_by!==req.user.id){
      return res.status(403).json({
        message:"Forbidden"
      })
    }

    todo.forEach(item=>{
      if(item.id===id){
        item.title=title ? title : item.title
        item.time=time ? time : item.time
      }
    })

    write_file("todo.json",todo)

    updateStats(req.user.id)

    return res.status(200).json({
      message:"Updated"
    })

  }catch(error){
    return res.status(500).json({
      message:error.message
    })
  }
}


const toggleTodo=async(req,res)=>{
  try{
    const {id}=req.params

    const todo=read_file("todo.json")

    const foundedTodo=todo.find((item)=>item.id===id)

    if(!foundedTodo){
      return res.status(404).json({
        message:"Not found"
      })
    }

    if(foundedTodo.added_by!==req.user.id){
      return res.status(403).json({
        message:"Forbidden"
      })
    }

    todo.forEach((item)=>{
      if(item.id===id){
        item.done=!item.done
      }
    })

    write_file("todo.json",todo)

    updateStats(req.user.id)

    return res.status(200).json({
      message:"Toggled"
    })

  }catch(error){
    return res.status(500).json({
      message:error.message
    })
  }
}


const deleteTodo=async(req,res)=>{
  try{
    const {id}=req.params

    const todo=read_file("todo.json")

    const foundedTodo=todo.find((item)=>item.id===id)

    if(!foundedTodo){
      return res.status(404).json({
        message:"Not found"
      })
    }

    if(foundedTodo.added_by!==req.user.id){
      return res.status(403).json({
        message:"Forbidden"
      })
    }

    todo.forEach((item,idx)=>{
      if(item.id===id){
        todo.splice(idx,1)
      }
    })

    write_file("todo.json",todo)

    updateStats(req.user.id)

    return res.status(200).json({
      message:"Deleted"
    })

  }catch(error){
    return res.status(500).json({
      message:error.message
    })
  }
}


const removeChecked=async(req,res)=>{
  try{
    const todo=read_file("todo.json")

    const newTodo=todo.filter((item)=>{
      if(item.added_by===req.user.id && item.done===true){
        return false
      }
      return true
    })

    write_file("todo.json",newTodo)

    updateStats(req.user.id)

    return res.status(200).json({
      message:"Removed checked"
    })

  }catch(error){
    return res.status(500).json({
      message:error.message
    })
  }
}


const updateStats=(userId)=>{
  const todo=read_file("todo.json")
  let stats=read_file("stats.json")

  const myTodo=todo.filter((item)=>item.added_by===userId)

  const total=myTodo.length
  const doneCount=myTodo.filter((item)=>item.done===true).length


  stats={
    userId, 
    total, 
    doneCount 
  }

  write_file("stats.json",stats)
}



const getStats=async(req,res)=>{
  try{
    const stats=read_file("stats.json")

    const myStats=stats[req.user.id] || {
      total:0,
      doneCount:0
    }

    return res.json(myStats)

  }catch(error){
    return res.status(500).json({
      message:error.message
    })
  }
}

module.exports={
  getAllTodos,
  addTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
  removeChecked,
  getStats
}
