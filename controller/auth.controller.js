const {v4}=require("uuid")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const {read_file,write_file}=require("../api/file-system")

const register=async(req,res)=>{
  try{
    const {username,email,password}=req.body

    if(!username || !email || !password){
      return res.status(400).json({
        message:"Username,email,password are required"
      })
    }

    const user=read_file("register.json")

    const foundedUser=user.find((item)=>item.email===email)

    if(foundedUser){
      return res.status(409).json({
        message:"Email already exists"
      })
    }

    const hash=await bcrypt.hash(password,12)

    user.push({
      id:v4(),
      username,
      email,
      password:hash,
      role:"user"
    })

    write_file("register.json",user)

    return res.status(201).json({
      message:"Registered"
    })

  }catch(error){
    return res.status(500).json({
      message:error.message
    })
  }
}

const login=async(req,res)=>{
  try{
    const {email,password}=req.body

    if(!email || !password){
      return res.status(400).json({
        message:"email,password are required"
      })
    }

    const user=read_file("register.json")

    const foundedUser=user.find((item)=>item.email===email)

    if(!foundedUser){
      return res.status(404).json({
        message:"User not found"
      })
    }

    const check=await bcrypt.compare(password,foundedUser.password)

    if(!check){
      return res.status(401).json({
        message:"Wrong password"
      })
    }

    const payload={id:foundedUser.id, email:foundedUser.email, role:foundedUser.role}
    const token=jwt.sign(payload, process.env.SECRET, {expiresIn:"2h"})

    return res.status(200).json({
      message:"Success",
      token
    })

  }catch(error){
    return res.status(500).json({
      message:error.message
    })
  }
}

module.exports={
  register,
  login
}
