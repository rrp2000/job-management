const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    try {

        const token = req.header("x-api-key")
        if(!token) {
            return res.status(403).send({ status:false, message:"Token is required" })
        }

        if( token.startsWith("Bearer ")) {
            token = token.slice(7).trim()
        }

        jwt.verify(token, process.env.JWT_SECRET,(err,decoded)=>{
            if(err) return res.status(401).send({ status:false, message:err.message })
            req.user = decoded
            return next()
        })
        
    } catch (error) {
        return res.status(500).json({ status:false,error: error.message });
    }
}

module.exports = {
    authMiddleware,
}