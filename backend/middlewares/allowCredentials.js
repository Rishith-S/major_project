const allowCredentials=(req,res,next)=>{
    const origin=req.headers.origin;
    if(origin === 'http://localhost:3000'){
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin,X-Request-With,Content-Type,Accept"
        );
    }
    next();
}

module.exports=allowCredentials;   