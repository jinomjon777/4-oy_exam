const jwt=require("jsonwebtoken")

module.exports=(req,res,next)=>{
  try{
    const auth=req.headers.authorization

    if(!auth){
      return res.status(401).json({
        message:"Token not found"
      })
    }

    const token=auth.split(" ")[1]

    const decode=jwt.verify(token,process.env.SECRET)
    req.user=decode

    next()
  }catch(error){
    return res.status(401).json({
      message:"Token invalid"
    })
  }
}
