import jwt from 'jsonwebtoken'
 const auth=async(req,res,next)=>{
    try{
     const authHeader=req.header('Auth')
     if(!authHeader){
        return res.status(401)//unauthorized
     }
     const token=authHeader.split(' ')[1]

     const isCustomAuth=token.length <500

     let decodedData;
     if(token && isCustomAuth){
        decodedData=jwt.verify(token,'secretKey')
        req.userId=decodedData?.id
     }
     else{
        decodedData=jwt.decode(token)
        req.userId=decodedData?.sub
     }
     next()
    }
    catch(error){
        console.log(error)
    }
}
export default auth;